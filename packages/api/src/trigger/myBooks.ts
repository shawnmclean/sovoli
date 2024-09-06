import type { MyBookHydrationErrorSchema } from "@sovoli/db/schema";
import { and, db, eq } from "@sovoli/db";
import { myBooks } from "@sovoli/db/schema";
import { AbortTaskRunError, logger, task } from "@trigger.dev/sdk/v3";

import { searchBooks } from "../service/books";

export interface HydrateMyBookOptions {
  myBookId: string;
}

export const hydrateMyBook = task({
  id: "hydrate-my-book",
  onFailure: async ({ myBookId }: HydrateMyBookOptions, error, { ctx }) => {
    let errorMessage = "An unknown error occurred";

    // Narrow the error type to check if it has a message property
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    if (errorMessage !== "MyBook not found") {
      await db
        .update(myBooks)
        .set({
          queryError: {
            message: errorMessage,
            triggerDevId: ctx.run.id,
          },
        })
        .where(eq(myBooks.id, myBookId));
    }
  },
  run: async ({ myBookId }: HydrateMyBookOptions, { ctx }) => {
    const myBook = await db.query.myBooks.findFirst({
      where: eq(myBooks.id, myBookId),
    });

    if (!myBook) {
      throw new Error(`MyBook not found`);
    }
    if (myBook.bookId) {
      logger.info(`MyBook already hydrated`);
      return;
    }
    if (!myBook.query) {
      throw new AbortTaskRunError("MyBook has no query");
    }

    logger.info(`Searching for query: ${myBook.query}`);
    const results = await searchBooks({ queries: [{ query: myBook.query }] });

    if (!results[0]?.books[0]) {
      throw new Error("No results found for query");
    }

    const bestMatch = results[0].books[0];

    try {
      await db
        .update(myBooks)
        .set({ bookId: bestMatch.id, name: bestMatch.title })
        .where(eq(myBooks.id, myBookId));
      logger.info(`Book: ${bestMatch.id} linked to myBook: ${myBookId}`);
    } catch (error) {
      const queryError: MyBookHydrationErrorSchema = {
        message: "Error linking query to book",
        triggerDevId: ctx.run.id,
      };

      // Check if the error is an object and has a code property
      if (isDatabaseError(error)) {
        // Handle specific database error codes
        if (error.code === "23505") {
          // if its a constraint violation, check if the book already exists for the user
          const bookExist = await db.query.myBooks.findFirst({
            columns: { id: true },
            where: and(
              eq(myBooks.ownerId, myBook.ownerId),
              eq(myBooks.bookId, bestMatch.id),
            ),
          });
          if (bookExist) {
            queryError.message = "Book already exists for the user";
            queryError.duplicatedMyBookId = bookExist.id;
          }
        } else {
          queryError.message = `Database error with code ${error.code}: ${error.message}`;
        }
      } else {
        queryError.message =
          error instanceof Error ? error.message : "Unknown error occurred";
      }

      logger.error(queryError.message);

      await db
        .update(myBooks)
        .set({
          queryError,
        })
        .where(eq(myBooks.id, myBookId));

      // Re-throw the error if it's not handled to ensure it's not silently ignored
      if (!queryError.duplicatedMyBookId) {
        throw new Error(queryError.message);
      }
    }
  },
});
/**
 * Type guard to check if an error is a database error with a code property.
 */
function isDatabaseError(
  error: unknown,
): error is { code: string; message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code: string }).code === "string"
  );
}
