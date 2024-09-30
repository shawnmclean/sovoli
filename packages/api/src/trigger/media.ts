import type { SelectMediaAssetSchema } from "@sovoli/db/schema";
import { db, eq, schema } from "@sovoli/db";
import { MediaAssetHost } from "@sovoli/db/schema";
import { createClient } from "@supabase/supabase-js";
import { logger, task } from "@trigger.dev/sdk/v3";
import { filetypeinfo } from "magic-bytes.js";

import { env } from "../env";
import { AsyncResilience } from "../utils/retry/AsyncResilience";
import { retryAsync } from "../utils/retry/retry-async";

const MAX_ALLOWED_FILE_SIZE = 1024 * 1024 * 3; // 3MB

export interface HydrateMediaOptions {
  mediaId: string;
}

export const hydrateMedia = task({
  id: "hydrate-media",
  run: async ({ mediaId }: HydrateMediaOptions, { ctx }) => {
    const workingMedia = await db
      .update(schema.MediaAsset)
      .set({
        triggerDevId: ctx.run.id,
      })
      .where(eq(schema.MediaAsset.id, mediaId))
      .returning();

    const media = workingMedia[0];
    if (!media) {
      throw new Error(`Media not found for id: ${mediaId}`);
    }
    let updatedMedia: CopyFileToSupabaseResult | null = null;
    let errorMessage: string | null = null;

    try {
      // Attempt to copy the file to Supabase
      updatedMedia = await copyFileToSupabase(media);
    } catch (error) {
      // Log the error and set error message for the media update
      console.log(error);
      errorMessage = error instanceof Error ? error.message : "Unknown error";
    }

    if (updatedMedia) {
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
    } else if (errorMessage) {
      await db
        .update(schema.MediaAsset)
        .set({
          updatedAt: new Date(),
          triggerDevError: errorMessage,
        })
        .where(eq(schema.MediaAsset.id, mediaId));
    }

    logger.info(`Hydrated media: ${mediaId}`);
  },
});

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

async function uploadFile(
  newFilename: string,
  fileBuffer: ArrayBuffer,
  mimeType: string,
) {
  const { data, error } = await supabase.storage
    .from(env.SUPABASE_MEDIA_BUCKET)
    .upload(newFilename, fileBuffer, {
      contentType: mimeType,
    });

  if (error) {
    throw new Error(`Supabase upload error: ${error.message}`);
  }

  return data;
}

async function downloadFile(downloadLink: string) {
  const response = await fetch(downloadLink);
  if (!response.ok) {
    throw new Error(
      `File download error: Failed to download media from: ${downloadLink}`,
    );
  }
  return response;
}

interface CopyFileToSupabaseResult {
  bucket: string;
  path: string;
  mimeType: string;
}

async function copyFileToSupabase(
  media: SelectMediaAssetSchema,
): Promise<CopyFileToSupabaseResult> {
  if (media.host === MediaAssetHost.Supabase) {
    throw new Error("Media is already on supabase");
  }
  const downloadLink = media.downloadLink;
  if (!downloadLink) {
    throw new Error("Media has no download link");
  }

  const response = await retryAsync(
    () => downloadFile(downloadLink),
    AsyncResilience.aggressive(),
  );

  const contentLength = response.headers.get("Content-Length");
  if (contentLength && parseInt(contentLength, 10) > MAX_ALLOWED_FILE_SIZE) {
    throw new Error(
      `File is too large, must be less than ${(MAX_ALLOWED_FILE_SIZE / (1024 * 1024)).toFixed(2)} MB`,
    );
  }

  // Convert the response into a buffer
  const fileBuffer = await response.arrayBuffer();

  // Convert to Uint8Array for magic-bytes.js, we only need the first 100 bytes
  const bytesForDetection = new Uint8Array(fileBuffer).slice(0, 100);
  const fileTypeResult = filetypeinfo(bytesForDetection);

  const mime = fileTypeResult[0]?.mime;
  const extension = fileTypeResult[0]?.extension;
  if (!mime || !extension) {
    throw new Error("Could not detect file type; mime or extension is missing");
  }

  const newFilename = `${media.id}.${extension}`;

  const data = await retryAsync(
    () => uploadFile(newFilename, fileBuffer, mime),
    AsyncResilience.exponentialBackoffWithJitter(),
  );

  return {
    bucket: env.SUPABASE_MEDIA_BUCKET,
    path: data.path,
    mimeType: mime,
  };
}
