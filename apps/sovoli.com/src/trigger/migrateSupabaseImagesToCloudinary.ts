import { db, eq, schema } from "@sovoli/db";
import { MediaAssetHost } from "@sovoli/db/schema";
import { createClient } from "@supabase/supabase-js";
import { logger, task } from "@trigger.dev/sdk/v3";
import { v2 as cloudinary } from "cloudinary";

import { env } from "../env";

// Configure Cloudinary
cloudinary.config({
  cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const migrateSupabaseImagesToCloudinary = task({
  id: "migrate-supabase-images-to-cloudinary",
  maxDuration: 20 * 60 * 1000, // 20 minutes
  run: async () => {
    const assets = await db.query.MediaAsset.findMany({
      where: eq(schema.MediaAsset.host, MediaAssetHost.Supabase),
    });

    logger.info(`Found ${assets.length} Supabase assets to migrate`);

    // Process assets in chunks to control concurrency
    const chunkSize = 5;
    for (let i = 0; i < assets.length; i += chunkSize) {
      const chunk = assets.slice(i, i + chunkSize);
      await Promise.all(chunk.map(processAsset));
      logger.info(
        `Processed ${Math.min(i + chunkSize, assets.length)} of ${assets.length} assets`,
      );
    }

    logger.info("Migration completed");
  },
});

async function processAsset(asset: typeof schema.MediaAsset.$inferSelect) {
  if (!asset.path) return;

  try {
    // Get the Supabase URL for the file
    const {
      data: { publicUrl },
    } = supabase.storage.from("media").getPublicUrl(asset.path);

    if (!publicUrl) {
      throw new Error(`Failed to get public URL for asset ${asset.id}`);
    }

    // Download the file from Supabase
    const response = await downloadFile(publicUrl);
    const buffer = await response.arrayBuffer();

    // Upload to Cloudinary
    await new Promise<void>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          public_id: asset.id,
          folder: env.SUPABASE_MEDIA_BUCKET,
        },
        (error) => {
          if (error)
            reject(new Error(`Cloudinary upload failed: ${error.message}`));
          else resolve();
        },
      );

      uploadStream.end(Buffer.from(buffer));
    });

    // Update the asset record
    await db
      .update(schema.MediaAsset)
      .set({
        host: MediaAssetHost.Cloudinary,
        bucket: env.SUPABASE_MEDIA_BUCKET,
        updatedAt: new Date(),
      })
      .where(eq(schema.MediaAsset.id, asset.id));

    // Remove from Supabase
    await removeFile(asset.path);

    logger.info(`Successfully migrated asset ${asset.id} to Cloudinary`);
  } catch (error) {
    const errorMessage = `Failed to migrate asset ${asset.id}: ${error instanceof Error ? error.message : String(error)}`;
    logger.error(errorMessage);

    // Update the asset with error information
    await db
      .update(schema.MediaAsset)
      .set({
        triggerDevError: errorMessage,
        updatedAt: new Date(),
      })
      .where(eq(schema.MediaAsset.id, asset.id));
  }
}

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

async function removeFile(path: string) {
  const { error } = await supabase.storage.from("media").remove([path]);

  if (error) {
    throw new Error(`Supabase remove error: ${error.message}`);
  }
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
