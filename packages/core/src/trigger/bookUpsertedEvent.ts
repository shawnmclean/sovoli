import { logger, task } from "@trigger.dev/sdk/v3";

export interface BookUpsertedEventOptions {
  bookId: string;
}

export const bookUpsertedEvent = task({
  id: "book-upserted-event",
  // eslint-disable-next-line @typescript-eslint/require-await
  run: async ({ bookId }: BookUpsertedEventOptions) => {
    logger.info(`Book upserted: ${bookId}`);
  },
});
