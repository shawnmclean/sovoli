import type { SelectBookSchema } from "@sovoli/db/schema";
import { db, eq } from "@sovoli/db";
import { BookCoverSchema, books as booksSchema } from "@sovoli/db/schema";
import { bookService } from "@sovoli/services";
import { logger, task } from "@trigger.dev/sdk/v3";

import { updateBookEmbeddings } from "../service/books/bookEmbeddings";

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
          // TODO: take out the authors and create a new table for them

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

          await updateBookEmbeddings([book.id]);
        }
      } catch (error) {
        logger.error(`Error hydrating book: ${bookId}`);
        throw error;
      }
    }

    if (isGoogleDataStale(book)) {
      logger.warn(`Google data is stale for bookId: ${bookId}`);
    }
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
