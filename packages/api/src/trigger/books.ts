import type {
  InsertAuthorSchema,
  InsertAuthorToBookSchema,
  SelectBookSchema,
} from "@sovoli/db/schema";
import { db, eq, sql } from "@sovoli/db";
import { Author, AuthorToBook, Book } from "@sovoli/db/schema";
import { bookService } from "@sovoli/services";
import { googlebooks } from "@sovoli/services/src/books";
import { AbortTaskRunError, logger, task } from "@trigger.dev/sdk/v3";

import {
  updateBookFromOpenLibrary,
  upsertBooksFromGoogle,
} from "../service/books/insert";
import { hydrateAuthor } from "./authors";

// import { updateBookEmbeddings } from "../service/books/bookEmbeddings";

export interface HydrateBookOptions {
  bookId: string;
}

export const hydrateBook = task({
  id: "hydrate-book",
  run: async ({ bookId }: HydrateBookOptions, { ctx }) => {
    const books = await db
      .update(Book)
      .set({
        triggerDevId: ctx.run.id,
      })
      .where(eq(Book.id, bookId))
      .returning();

    const book = books[0];
    if (!book) {
      logger.error(`Book not found for bookId: ${bookId}`);
      return;
    }

    const [oLBookData, googleBookData] = await Promise.all([
      hydrateBookFromOpenLibrary(book),
      hydrateBookFromGoogle(book),
    ]);

    if (!oLBookData && !googleBookData) {
      logger.info(`No need to hydrate book: ${book.id}`);
      return;
    }

    // await hydrateBook.trigger({ bookId: book.id });

    // TODO: turn back on when we figure out RAG
    // await updateBookEmbeddings([book.id]);
  },
});

async function hydrateBookFromOpenLibrary(book: SelectBookSchema) {
  if (!isOLDataStale(book)) {
    logger.info(
      `Book is not stale, not hydrating book from openlibrary: ${book.id}`,
    );
    return;
  }

  logger.info(`Hydrating book from openlibrary: ${book.id}`);

  const isbn = book.isbn13 ?? book.isbn10;
  if (!isbn) {
    logger.error(`No ISBN found for bookId: ${book.id}`);
    return;
  }
  const olBook = await bookService.openlibrary.getBookByISBN(isbn);

  if (!olBook) {
    throw new AbortTaskRunError(
      `Book not found on Open Library for bookId: ${book.id} with isbn: ${isbn}`,
    );
  }

  const updatedBook = await updateBookFromOpenLibrary(book.id, olBook);

  logger.info(`Hydrated book from openlibrary: ${updatedBook.id}`);

  logger.info(
    `Updating authors: ${olBook.authors.map((author) => author.olid).join(", ")}`,
  );

  const insertedAuthors = await upsertAuthors(
    olBook.authors.map((author) => ({
      name: author.name,
      olid: author.olid,
    })),
  );
  if (insertedAuthors.length === 0) {
    logger.info(`No authors updated for book: ${book.id}`);
    return;
  }
  logger.info(
    `Added authors, authorIds: ${insertedAuthors.map((author) => author.id).join(", ")}`,
  );

  // run hydrate authors
  await hydrateAuthor.batchTrigger(
    insertedAuthors.map((author) => ({ payload: { authorId: author.id } })),
  );

  if (insertedAuthors.length > 0) {
    const insertedAuthorsToBooks = await upsertAuthorsToBooks(
      insertedAuthors.map((author) => ({
        authorId: author.id,
        bookId: updatedBook.id,
      })),
    );
    logger.info(
      `Linked ${insertedAuthorsToBooks.length} authors to book: ${book.id}`,
    );
  }

  return updatedBook;
}
async function hydrateBookFromGoogle(book: SelectBookSchema) {
  if (!isGoogleDataStale(book)) {
    logger.info(
      `Book is not stale, not hydrating book from google: ${book.id}`,
    );
    return;
  }

  logger.info(`Hydrating book from google: ${book.id}`);
  const isbn = book.isbn13 ?? book.isbn10;
  if (!isbn) {
    logger.error(`No ISBN found for bookId: ${book.id}`);
    return;
  }
  const result = await googlebooks.searchGoogleBooks({ isbn });

  const googleBook = result[0];
  if (!googleBook) return null;

  const [insertedBook] = await upsertBooksFromGoogle([googleBook]);
  logger.info(`Hydrated book from google: ${book.id}`);
  return insertedBook;
}

/**
 * Should always return the authors and their ids that matched the olid
 * @param authors
 * @returns
 */
async function upsertAuthors(authors: InsertAuthorSchema[]) {
  if (authors.length === 0) return [];
  const insertedAuthors = await db
    .insert(Author)
    .values(authors)
    .onConflictDoUpdate({
      target: [Author.olid],
      set: {
        name: sql.raw(`excluded.${Author.name.name}`),
      },
    })
    .returning();

  return insertedAuthors;
}

async function upsertAuthorsToBooks(
  authorsToBooks: InsertAuthorToBookSchema[],
) {
  if (authorsToBooks.length === 0) return [];
  const insertedAuthorsToBooks = await db
    .insert(AuthorToBook)
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
