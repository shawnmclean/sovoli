import type { SelectMediaAssetSchema } from "@sovoli/db/schema";
import { db, eq, schema } from "@sovoli/db";
import { MediaAssetHost } from "@sovoli/db/schema";
import { createClient } from "@supabase/supabase-js";
import { logger, task } from "@trigger.dev/sdk/v3";
import { filetypeinfo } from "magic-bytes.js";

import { env } from "../env";

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

const uploadWithRetries = async (
  newFilename: string,
  fileBuffer: ArrayBuffer,
  mimeType: string,
) => {
  const maxRetries = 3;
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      const { data, error } = await supabase.storage
        .from(env.SUPABASE_MEDIA_BUCKET)
        .upload(newFilename, fileBuffer, {
          contentType: mimeType,
        });

      if (error) {
        throw new Error(error.message);
      }

      return data; // Successful upload
    } catch (e) {
      attempts++;
      if (attempts >= maxRetries) {
        if (e instanceof Error) {
          logger.error(
            `Failed to upload file after ${attempts} attempts: ${e.message}`,
          );
          throw e; // rethrow the error
        } else {
          logger.error(
            `Failed to upload file after ${attempts} attempts due to an unknown error`,
          );
          throw new Error("Unknown error occurred during upload");
        }
      }
      await new Promise((resolve) => setTimeout(resolve, attempts * 1000)); // Backoff
    }
  }

  // If we reach here, it means all retries failed (used to satisfy typescript undefined return type)
  throw new Error("Upload failed after all retries");
};

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
  if (!media.downloadLink) {
    throw new Error("Media has no download link");
  }

  const response = await fetch(media.downloadLink);
  if (!response.ok) {
    throw new Error(`Failed to download media from: ${media.downloadLink}`);
  }
  const contentLength = response.headers.get("Content-Length");
  if (contentLength && parseInt(contentLength, 10) > MAX_ALLOWED_FILE_SIZE) {
    throw new Error("File is too large to process");
  }

  // Convert the response into a buffer
  const fileBuffer = await response.arrayBuffer();

  // Convert to Uint8Array for magic-bytes.js, we only need the first 100 bytes
  const bytesForDetection = new Uint8Array(fileBuffer).slice(0, 100);
  const fileTypeResult = filetypeinfo(bytesForDetection);

  const fileType = fileTypeResult[0];
  if (!fileType || !fileType.mime || !fileType.extension) {
    throw new Error("Could not detect file type, mime, or extension");
  }

  const newFilename = `${media.id}.${fileType.extension}`;

  const data = await uploadWithRetries(newFilename, fileBuffer, fileType.mime);

  return {
    bucket: env.SUPABASE_MEDIA_BUCKET,
    path: data.path,
    mimeType: fileType.mime,
  };
}
