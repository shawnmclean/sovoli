import type { SelectMediaAssetSchema } from "@sovoli/db/schema";
import { db, eq, schema } from "@sovoli/db";
import { MediaAssetHost } from "@sovoli/db/schema";
import { createClient } from "@supabase/supabase-js";
import { logger, task } from "@trigger.dev/sdk/v3";

import { env } from "../env";

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

    const updatedMedia = await copyFileToSupabase(media);

    await db
      .update(schema.MediaAsset)
      .set({
        host: MediaAssetHost.Supabase,
        bucket: updatedMedia.bucket,
        path: updatedMedia.path,
        mimeType: updatedMedia.mimeType,
        updatedAt: new Date(),
      })
      .where(eq(schema.MediaAsset.id, mediaId));

    logger.info(`Hydrated media: ${mediaId}`);
  },
});

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
async function copyFileToSupabase(media: SelectMediaAssetSchema) {
  if (media.host === MediaAssetHost.Supabase) {
    throw new Error("Media is already on supabase");
  }
  if (!media.downloadLink) {
    throw new Error("Media has no download link");
  }

  try {
    const response = await fetch(media.downloadLink);
    if (!response.ok) {
      throw new Error(`Failed to download media from: ${media.downloadLink}`);
    }

    // Convert the response into a buffer
    const fileBuffer = await response.arrayBuffer();

    // Use the mimeType from the database or fallback to the response header content type
    const finalMimeType =
      media.mimeType ?? response.headers.get("content-type");

    //TODO: may want to get the mime type from the file extension
    if (!finalMimeType) {
      throw new Error("Could not determine MIME type");
    }

    // Extract the file extension from the `name` field
    const fileExtension = media.name?.split(".").pop();

    if (!fileExtension) {
      throw new Error("Could not determine file extension");
    }

    const path = `${media.id}.${fileExtension}`;
    const { data, error } = await supabase.storage
      .from(env.SUPABASE_MEDIA_BUCKET)
      .upload(path, new Blob([fileBuffer]), { contentType: finalMimeType });

    if (error) {
      throw error;
    }

    return {
      bucket: env.SUPABASE_MEDIA_BUCKET,
      path: data.path,
      mimeType: finalMimeType,
    };
  } catch (e) {
    console.log(e);
    throw e;
  }
}
