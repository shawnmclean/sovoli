import { and, db, eq, isNull } from "@sovoli/db";
import { myBooks } from "@sovoli/db/schema";
import { task } from "@trigger.dev/sdk/v3";

import { searchExternallyAndPopulate } from "../service/books";
import { getBestMatch } from "../service/mybooks";

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

    const results = await searchExternallyAndPopulate(queries);

    const updatedBooks = userBooks
      .map((myBook) => {
        const matchedResult = results.find(
          (result) => result.query.query === myBook.query,
        );

        if (matchedResult && matchedResult.books.length > 0) {
          const bestMatch = getBestMatch(matchedResult.books);
          if (!bestMatch) return null;
          return {
            myBookId: myBook.id,
            book: bestMatch.book,
          };
        }
        return null;
      })
      .filter(Boolean);

    // Step 5: Update the myBooks table with the matched bookIds
    for (const updatedBook of updatedBooks) {
      if (!updatedBook) continue;
      await db
        .update(myBooks)
        .set({
          bookId: updatedBook.book.id,
          name: updatedBook.book.title,
        })
        .where(eq(myBooks.id, updatedBook.myBookId));
    }

    console.log(">>> results", { results });
  },
});
