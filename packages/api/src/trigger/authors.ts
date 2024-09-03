import { logger, task, wait } from "@trigger.dev/sdk/v3";

export interface HydrateAuthorOptions {
  authorId: string;
}

export const hydrateAuthor = task({
  id: "hydrate-author",
  run: async ({ authorId }: HydrateAuthorOptions, { ctx }) => {
    logger.log(`q: ${authorId}`, { authorId, ctx });

    await wait.for({ seconds: 5 });

    return {
      message: `Hello, ${authorId}!`,
    };
  },
});
