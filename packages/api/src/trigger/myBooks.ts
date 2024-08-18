import { and, db, eq, isNull } from "@sovoli/db";
import { myBooks } from "@sovoli/db/schema";
import { logger, task, wait } from "@trigger.dev/sdk/v3";

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
        triggerDevId: ctx.task.id,
      })
      .where(and(eq(myBooks.ownerId, userId), isNull(myBooks.bookId)))
      .returning();

    logger.log(`>>> hydrating books`, { userBooks });
  },
});
