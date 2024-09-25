import { db, eq, schema } from "@sovoli/db";
import { logger, task } from "@trigger.dev/sdk/v3";

export interface HydrateMediaOptions {
  mediaId: string;
}

export const hydrateMedia = task({
  id: "hydrate-media",
  run: async ({ mediaId }: HydrateMediaOptions) => {
    const media = await db.query.MediaAsset.findFirst({
      where: eq(schema.MediaAsset.id, mediaId),
    });
    if (!media) {
      throw new Error(`Media not found`);
    }
    logger.info(`Hydrating media: ${mediaId}`);
  },
});
