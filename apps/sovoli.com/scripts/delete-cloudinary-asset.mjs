/**
 * Delete Cloudinary Asset
 *
 * This script deletes an existing Cloudinary asset.
 *
 * Usage:
 *   pnpm with-env node scripts/delete-cloudinary-asset.mjs <public-id>
 *
 * Example:
 *   pnpm with-env node scripts/delete-cloudinary-asset.mjs \
 *     "o/vocational-school/jamaica/healingemeraldwellness/services/microneedling/sex1ithgpj9olhpkigri"
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
const [publicId] = process.argv.slice(2);

if (!publicId) {
  console.error("Usage: node delete-cloudinary-asset.mjs <public-id>");
  console.error(
    'Example: node delete-cloudinary-asset.mjs "o/org/services/old/image"',
  );
  process.exit(1);
}

// TypeScript: ensure this is a string after validation
/** @type {string} */
const publicIdStr = publicId;

async function deleteAsset() {
  try {
    console.log(`Deleting asset: ${publicIdStr}`);

    // Delete the asset
    const result = await cloudinary.uploader.destroy(publicIdStr, {
      resource_type: "image",
      invalidate: true, // Invalidate CDN cache
    });

    if (result.result === "ok") {
      console.log("\n✅ Asset deleted successfully!");
      console.log(`Result: ${result.result}`);
    } else if (result.result === "not found") {
      console.log("\n⚠️  Asset not found (may have already been deleted)");
      console.log(`Result: ${result.result}`);
    } else {
      console.log("\n❌ Failed to delete asset");
      console.log(`Result: ${result.result}`);
    }
  } catch (error) {
    console.error("Error deleting asset:", error);
    process.exit(1);
  }
}

deleteAsset();
