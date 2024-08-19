import { db, inArray } from "@sovoli/db";
import { books as booksSchema } from "@sovoli/db/schema";
import { task } from "@trigger.dev/sdk/v3";

export interface HydrateBooksOptions {
  bookIds: string[];
}

export const hydrateBooks = task({
  id: "hydrate-books",
  run: async ({ bookIds }: HydrateBooksOptions, { ctx }) => {
    const books = await db
      .update(booksSchema)
      .set({
        triggerDevId: ctx.run.id,
      })
      .where(inArray(booksSchema.id, bookIds))
      .returning();

    if (books.length === 0) return;

    // print book titles
    books.forEach((book) => console.log(book.title));

    // check if google book is stale (> 3 months old)

    // check if openlibrary book is stale (> 3 months old)

    // embeddings update
  },
});
