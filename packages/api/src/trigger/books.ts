import type {
  InsertAuthorSchema,
  InsertAuthorToBookSchema,
  InsertBookSchema,
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

import { insertBooks } from "../service/books/insert";
import { hydrateAuthor } from "./authors";

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
      logger.error(`No ISBN found for bookId: ${book.id}`);
      return;
    }

    const [oLBookData, googleBookData] = await Promise.all([
      isOLDataStale(book) ? getFromOL(isbn) : null,
      isGoogleDataStale(book) ? getFromGoogle(isbn) : null,
    ]);

    // Merge the new data, prioritizing Google Books data if both exist
    const mergedBookData: Partial<InsertBookSchema> = {
      isbn13: googleBookData?.isbn13 ?? oLBookData?.isbn13,
      isbn10: googleBookData?.isbn10 ?? oLBookData?.isbn10,
      olid: oLBookData?.olid ?? book.olid,
      title: googleBookData?.title ?? oLBookData?.title ?? book.title,
      subtitle: googleBookData?.subtitle ?? book.subtitle,
      publishedDate: googleBookData?.publishedDate?.toISOString(),
      publisher:
        googleBookData?.publisher ?? oLBookData?.publisher ?? book.publisher,
      pageCount: googleBookData?.pageCount ?? book.pageCount,
      description: googleBookData?.description ?? book.description,
      language: googleBookData?.language ?? book.language,
      cover: oLBookData?.cover
        ? BookCoverSchema.parse(oLBookData.cover)
        : book.cover,
      lastGoogleUpdated: googleBookData
        ? new Date().toISOString()
        : book.lastGoogleUpdated,
      lastOLUpdated: oLBookData ? new Date().toISOString() : book.lastOLUpdated,
      inferredAuthor: googleBookData?.authors
        ? Array.isArray(googleBookData.authors)
          ? googleBookData.authors.join(", ")
          : googleBookData.authors
        : book.inferredAuthor,
      updatedAt: new Date().toISOString(),
    };

    // Merge with the existing book data
    const finalBookData: InsertBookSchema = {
      ...book,
      ...mergedBookData,
    };

    const [[insertedBook], insertedAuthors] = await Promise.all([
      insertBooks([finalBookData]),
      insertAuthors(
        oLBookData?.authors.map((author) => ({
          name: author.name,
          olid: author.olid,
        })) ?? [],
      ),
    ]);

    logger.info(`Upserted book: ${finalBookData.id}`);
    logger.info(
      `Upserted authors: ${insertedAuthors.map((a) => a.id).join(", ")}`,
    );

    // there should only be one book inserted/updated
    if (insertedBook) {
      // link the authors to the book
      const insertedAuthorsToBooks = await insertAuthorToBooks(
        insertedAuthors.map((author) => ({
          authorId: author.id,
          bookId: insertedBook.id,
        })),
      );
      logger.info(`Linked authors to book: ${insertedAuthorsToBooks.length}`);
    }

    await hydrateAuthor.batchTrigger(
      insertedAuthors.map((author) => ({ payload: { authorId: author.id } })),
    );

    // TODO: turn back on when we figure out RAG
    // await updateBookEmbeddings([book.id]);
  },
});

async function getFromOL(isbn: string) {
  logger.info(`Fetching book from openlibrary: ${isbn}`);
  const result = await bookService.openlibrary.getBookByISBN(isbn);
  return result;
}
async function getFromGoogle(isbn: string) {
  logger.info(`Fetching book from google: ${isbn}`);
  const result = await googlebooks.searchGoogleBooks({ isbn });
  return result[0] ?? null;
}

async function insertAuthors(authors: InsertAuthorSchema[]) {
  if (authors.length === 0) return [];
  const insertedAuthors = await db
    .insert(authorsSchema)
    .values(authors)
    .onConflictDoUpdate({
      target: [authorsSchema.olid],
      set: {
        name: sql.raw(`excluded.${authorsSchema.name.name}`),
      },
    })
    .returning();

  return insertedAuthors;
}

async function insertAuthorToBooks(authorsToBooks: InsertAuthorToBookSchema[]) {
  if (authorsToBooks.length === 0) return [];
  const insertedAuthorsToBooks = await db
    .insert(authorsToBooksSchema)
    .values(authorsToBooks)
    .onConflictDoNothing()
    .returning();

  return insertedAuthorsToBooks;
}

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
