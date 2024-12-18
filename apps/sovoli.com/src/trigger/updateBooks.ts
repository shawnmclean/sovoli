import { db, isNull, lt, or, schema } from "@sovoli/db";
import { logger, task } from "@trigger.dev/sdk/v3";

import { FindBookByISBN } from "~/services/books/findBookByISBN";

export const updateBooks = task({
  id: "update-books",
  run: async () => {
    // get books with lastisbndbupdated < now - 5 days
    // TODO remove other date fields
    // run 250 at a time, since there is a 5 mins limit on the trigger and we're limited to 1 second between requests
    // So we will run this every 5 mins, 7 times per day (7 times because our cap is 2000 requests per day and we want to keep
    // 250 budget for other stuff just in case)
    const books = await db.query.Book.findMany({
      where: or(
        lt(
          schema.Book.lastISBNdbUpdated,
          new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        ),
        isNull(schema.Book.lastISBNdbUpdated),
      ),
      limit: 250,
    });

    logger.info(`Found ${books.length} books to update`);

    let booksUpdated = 0;
    let lastRequestTime = 0;

    const findBookByISBN = new FindBookByISBN();
    for (const { isbn10, isbn13 } of books) {
      const isbn = isbn13 ?? isbn10;
      if (!isbn) continue;

      // Calculate wait time needed to maintain 1 second between requests
      const now = Date.now();
      const timeSinceLastRequest = now - lastRequestTime;
      const waitTime = Math.max(0, 1000 - timeSinceLastRequest);

      if (waitTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }

      lastRequestTime = Date.now();
      const result = await findBookByISBN.call({
        isbn,
        forceExternal: true,
      });

      if (!result.book) {
        logger.error(`Failed to find book ${isbn}`);
        continue;
      }

      logger.info(`Updated book ${result.book.id}`);
      booksUpdated++;
    }

    logger.info(`Updated ${booksUpdated} books`);
  },
});
