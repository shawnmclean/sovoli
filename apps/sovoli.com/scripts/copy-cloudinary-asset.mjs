/**
 * Copy Cloudinary Asset
 *
 * This script copies an existing Cloudinary asset to a new location
 * while maintaining backwards compatibility.
 *
 * Usage:
 *   pnpm with-env node scripts/copy-cloudinary-asset.mjs <from-public-id> <to-public-id>
 *
 * Example:
 *   pnpm with-env node scripts/copy-cloudinary-asset.mjs \
 *     "o/vocational-school/jamaica/healingemeraldwellness/services/microneedling/sex1ithgpj9olhpkigri" \
 *     "o/vocational-school/jamaica/healingemeraldwellness/services/wart-removal/sex1ithgpj9olhpkigri"
 */

import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from root .env file
dotenv.config({ path: path.join(process.cwd(), "../../../.env") });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get command line arguments
const [fromPublicId, toPublicId] = process.argv.slice(2);

if (!fromPublicId || !toPublicId) {
  console.error("Usage: node copy-cloudinary-asset.mjs <from-public-id> <to-public-id>");
  console.error(
    'Example: node copy-cloudinary-asset.mjs "o/org/services/old/image" "o/org/services/new/image"',
  );
  process.exit(1);
}

async function copyAsset() {
  try {
    console.log(`Copying asset from: ${fromPublicId}`);
    console.log(`To: ${toPublicId}`);

    // Use upload with the existing asset URL to create a copy
    // First, get the existing asset URL
    const existingAsset = await cloudinary.api.resource(fromPublicId, {
      resource_type: "image",
    });

    console.log(`Found existing asset: ${existingAsset.secure_url}`);

    // Upload the existing image to the new location
    // We'll use the URL of the existing asset
    const uploadResult = await cloudinary.uploader.upload(existingAsset.secure_url, {
      public_id: toPublicId,
      overwrite: false,
      invalidate: true,
    });

    console.log("\n✅ Asset copied successfully!");
    console.log("\nNew asset details:");
    console.log(JSON.stringify(
      {
        id: toPublicId.split("/").pop(),
        type: "image",
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        assetId: uploadResult.asset_id,
        bucket: toPublicId.substring(0, toPublicId.lastIndexOf("/")),
        format: uploadResult.format,
        bytes: uploadResult.bytes,
        version: uploadResult.version,
        uploadedAt: uploadResult.created_at,
        width: uploadResult.width,
        height: uploadResult.height,
        caption: "wart-removal.jpeg",
        alt: "wart-removal.jpeg",
      },
      null,
      2,
    ));
  } catch (error) {
    console.error("Error copying asset:", error);
    process.exit(1);
  }
}

copyAsset();
