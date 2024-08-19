import { and, db, eq, isNull } from "@sovoli/db";
import { myBooks, SelectBookSchema } from "@sovoli/db/schema";
import { task } from "@trigger.dev/sdk/v3";

import type { MatchedBook } from "../service/books";
import { searchBooks } from "../service/books";

export interface HydrateMyBooksOptions {
  userId: string;
}

//1. You need to export each task
export const hydrateMyBooks = task({
  //2. Use a unique id for each task
  id: "hydrate-my-books",
  //3. The run function is the main function of the task
  run: async ({ userId }: HydrateMyBooksOptions, { ctx }) => {
    const userBooks = await db
      .update(myBooks)
      .set({
        triggerDevId: ctx.run.id,
      })
      .where(and(eq(myBooks.ownerId, userId), isNull(myBooks.bookId)))
      .returning();

    if (userBooks.length === 0) return;

    // searchandpopulate the books by query
    // get the book ids, then update the myBooks table with the book ids
    // set the triggerDevId to null.
    // fire off a batch trigger to hydrate the books
    const queries = userBooks.map((myBook) => ({
      query: myBook.query ?? undefined,
    }));

    const results = await searchBooks({ queries });

    const updatedBooks = userBooks.reduce<
      { myBookId: string; book: SelectBookSchema }[]
    >((acc, myBook) => {
      const matchedResult = results.find(
        (result) => result.query.query === myBook.query,
      );

      if (matchedResult && matchedResult.books.length > 0) {
        const bestMatch = matchedResult.books[0]; //getBestMatch(matchedResult.books);
        if (bestMatch) {
          acc.push({
            myBookId: myBook.id,
            book: bestMatch,
          });
        }
      }
      return acc;
    }, []);

    // Step 5: Update the myBooks table with the matched bookIds
    for (const updatedBook of updatedBooks) {
      await db
        .update(myBooks)
        .set({
          bookId: updatedBook.book.id,
          name: updatedBook.book.title,
        })
        .where(eq(myBooks.id, updatedBook.myBookId));
    }
  },
});

/**
 * Get the best match from a list of matched books based on similarity.
 * @param books
 * @returns MatchedBook | undefined
 */
export function getBestMatch(books: MatchedBook[]): MatchedBook | undefined {
  return books.reduce(
    (bestMatch, currentBook) =>
      (currentBook.similarity ?? 0) > (bestMatch?.similarity ?? 0)
        ? currentBook
        : bestMatch,
    books[0],
  );
}
