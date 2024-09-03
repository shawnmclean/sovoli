import type {
  InsertAuthorSchema,
  InsertAuthorToBookSchema,
  SelectBookSchema,
} from "@sovoli/db/schema";
import { db, eq, sql } from "@sovoli/db";
import {
  authors as authorsSchema,
  authorsToBooks as authorsToBooksSchema,
  BookCoverSchema,
  books as booksSchema,
} from "@sovoli/db/schema";
import { bookService } from "@sovoli/services";
import { googlebooks } from "@sovoli/services/src/books";
import { logger, task } from "@trigger.dev/sdk/v3";

// import { updateBookEmbeddings } from "../service/books/bookEmbeddings";

export interface HydrateBookOptions {
  bookId: string;
}

export const hydrateBook = task({
  id: "hydrate-book",
  run: async ({ bookId }: HydrateBookOptions, { ctx }) => {
    const books = await db
      .update(booksSchema)
      .set({
        triggerDevId: ctx.run.id,
      })
      .where(eq(booksSchema.id, bookId))
      .returning();

    const book = books[0];
    if (!book) {
      logger.error(`Book not found for bookId: ${bookId}`);
      return;
    }

    const isbn = book.isbn13 ?? book.isbn10;
    if (!isbn) {
      logger.error(`No ISBN found for bookId: ${bookId}`);
      return;
    }

    if (isOLDataStale(book)) {
      try {
        const olBookData = await bookService.openlibrary.getBookByISBN(isbn);
        if (olBookData) {
          await db
            .update(booksSchema)
            .set({
              isbn13: olBookData.isbn13 ?? undefined,
              isbn10: olBookData.isbn10 ?? undefined,
              olid: olBookData.olid,
              publishedDate: olBookData.publishedDate?.toISOString(),
              publisher: olBookData.publisher,
              lastOLUpdated: new Date().toISOString(),
              cover: olBookData.cover
                ? BookCoverSchema.parse(olBookData.cover)
                : undefined,
              updatedAt: new Date().toISOString(),
            })
            .where(eq(booksSchema.id, book.id));

          const insertAuthors: InsertAuthorSchema[] = olBookData.authors.map(
            (author) => ({
              name: author.name,
              olid: author.olid,
            }),
          );
          const insertedAuthors = await db
            .insert(authorsSchema)
            .values(insertAuthors)
            .onConflictDoUpdate({
              target: [authorsSchema.olid],
              set: {
                name: sql.raw(`excluded.${authorsSchema.name.name}`),
              },
            })
            .returning();

          const insertAuthorToBooks: InsertAuthorToBookSchema[] =
            insertedAuthors.map((author) => ({
              authorId: author.id,
              bookId: book.id,
            }));
          await db
            .insert(authorsToBooksSchema)
            .values(insertAuthorToBooks)
            .onConflictDoNothing();
        }
      } catch (error) {
        logger.error(`Error hydrating book from openlibrary: ${bookId}`);
        throw error;
      }
    }

    if (isGoogleDataStale(book)) {
      try {
        const googleBooks = await googlebooks.searchGoogleBooks({ isbn });
        const book = googleBooks[0];
        if (book) {
          await db.update(booksSchema).set({
            isbn13: book.isbn13,
            isbn10: book.isbn10,
            title: book.title,
            subtitle: book.subtitle ?? null,
            publishedDate: book.publishedDate?.toISOString(),
            publisher: book.publisher,
            pageCount: book.pageCount,
            description: book.description,
            language: book.language,
            lastGoogleUpdated: new Date().toISOString(),
            inferredAuthor: Array.isArray(book.authors)
              ? book.authors.join(", ")
              : book.authors,
            cover: {
              small: book.thumbnail ?? null,
              medium: book.thumbnail ?? null,
              large: book.thumbnail ?? null,
            },
          });
        }
      } catch (error) {
        logger.error(`Error hydrating book from google: ${bookId}`);
        throw error;
      }
      logger.warn(`Google data is stale for bookId: ${bookId}`);
    }

    // TODO: turn back on when we figure out RAG
    // await updateBookEmbeddings([book.id]);
  },
});

const THREE_MONTHS_IN_MS = 1000 * 60 * 60 * 24 * 30 * 3;

function isOLDataStale(book: SelectBookSchema) {
  const { lastOLUpdated } = book;

  const lastOLUpdatedTime = lastOLUpdated
    ? new Date(lastOLUpdated).getTime()
    : 0;

  return lastOLUpdatedTime < Date.now() - THREE_MONTHS_IN_MS;
}

function isGoogleDataStale(book: SelectBookSchema) {
  const { lastGoogleUpdated } = book;

  const lastGoogleUpdatedTime = lastGoogleUpdated
    ? new Date(lastGoogleUpdated).getTime()
    : 0;

  return lastGoogleUpdatedTime < Date.now() - THREE_MONTHS_IN_MS;
}
