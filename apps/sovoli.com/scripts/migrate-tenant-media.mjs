/**
 * Migrate Tenant Media to Direct Tenant Path
 *
 * This script migrates media files from category-based Cloudinary paths to
 * the required direct tenant path format: o/{tenant-name}/...
 *
 * Usage:
 *   pnpm with-env node scripts/migrate-tenant-media.mjs <media-json-path> <tenant-username>
 *
 * Example:
 *   pnpm with-env node scripts/migrate-tenant-media.mjs \
 *     "src/modules/data/organisations/vocational-school/jamaica/healingemeraldwellness/media.json" \
 *     "healingemeraldwellness"
 *
 * Arguments:
 *   <media-json-path>  - Path to the tenant's media.json file (relative to workspace root or absolute)
 *   <tenant-username>  - The tenant's username identifier (e.g., "healingemeraldwellness", "fitright")
 *
 * Output:
 *   - Updated media.json file (with backup created)
 *   - State file: scripts/{tenant-username}-migration-old-files.json
 *   - Migration report in console
 */

import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
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
const [mediaJsonPath, tenantUsername] = process.argv.slice(2);

if (!mediaJsonPath || !tenantUsername) {
  console.error("Usage: node migrate-tenant-media.mjs <media-json-path> <tenant-username>");
  console.error(
    'Example: node migrate-tenant-media.mjs "src/modules/data/organisations/vocational-school/jamaica/healingemeraldwellness/media.json" "healingemeraldwellness"',
  );
  process.exit(1);
}

/** @type {string} */
const mediaJsonPathStr = mediaJsonPath;
/** @type {string} */
const tenantUsernameStr = tenantUsername;

// Required target format
const TARGET_PREFIX = `o/${tenantUsernameStr}/`;

/**
 * Extract path segment after tenant name from old publicId
 * Examples:
 *   o/vocational-school/jamaica/healingemeraldwellness/team/alicia/file
 *   -> team/alicia/file
 * @param {string} oldPublicId - The old Cloudinary public ID
 * @param {string} tenantUsername - The tenant username
 * @returns {string} The path segment after the tenant name
 */
function extractPathSegment(oldPublicId, tenantUsername) {
  // Find the tenant name in the path (with leading slash)
  const tenantPattern = `/${tenantUsername}/`;
  const tenantIndex = oldPublicId.indexOf(tenantPattern);

  if (tenantIndex !== -1) {
    // Extract everything after /{tenantUsername}/
    const pathAfterTenant = oldPublicId.substring(tenantIndex + tenantPattern.length);
    return pathAfterTenant; // Returns "team/alicia/file" (no leading slash)
  }

  // Fallback: try pattern without trailing slash (in case tenant is at end)
  const tenantPatternNoSlash = `/${tenantUsername}`;
  const tenantIndexNoSlash = oldPublicId.lastIndexOf(tenantPatternNoSlash);

  if (tenantIndexNoSlash !== -1 && tenantIndexNoSlash + tenantPatternNoSlash.length < oldPublicId.length) {
    // There's something after the tenant name
    const pathAfterTenant = oldPublicId.substring(tenantIndexNoSlash + tenantPatternNoSlash.length + 1);
    return pathAfterTenant;
  }

  // Last resort: extract filename and assume it's in root
  const parts = oldPublicId.split("/");
  const filename = parts[parts.length - 1];
  return filename || "";
}

/**
 * Detect resource type from media object
 * @param {Record<string, unknown>} mediaItem - The media item object
 * @returns {"image" | "video"} The resource type
 */
function detectResourceType(mediaItem) {
  if (mediaItem.type === "video") {
    return "video";
  }
  // Check URL for video indicators
  if (mediaItem.url && typeof mediaItem.url === "string" && /\.(mp4|mov|webm)$/i.test(mediaItem.url)) {
    return "video";
  }
  // Check format
  if (mediaItem.format && typeof mediaItem.format === "string" && /^(mp4|mov|webm)$/i.test(mediaItem.format)) {
    return "video";
  }
  return "image";
}

async function migrateMedia() {
  try {
    console.log(`\n=== Migrating Media for Tenant: ${tenantUsernameStr} ===\n`);

    // Resolve media.json path
    let mediaJsonFullPath = path.isAbsolute(mediaJsonPathStr)
      ? mediaJsonPathStr
      : path.resolve(process.cwd(), mediaJsonPathStr);

    // If file doesn't exist, try resolving from workspace root
    if (!fs.existsSync(mediaJsonFullPath)) {
      const workspaceRoot = path.resolve(process.cwd(), "../../../");
      const altPath = path.resolve(workspaceRoot, mediaJsonPathStr);
      if (fs.existsSync(altPath)) {
        mediaJsonFullPath = altPath;
      }
    }

    if (!fs.existsSync(mediaJsonFullPath)) {
      throw new Error(`Media JSON file not found: ${mediaJsonFullPath}`);
    }

    console.log(`Reading media.json from: ${mediaJsonFullPath}`);

    // Read media.json
    const mediaJsonContent = fs.readFileSync(mediaJsonFullPath, "utf8");
    const mediaData = JSON.parse(mediaJsonContent);

    if (!mediaData.media || !Array.isArray(mediaData.media)) {
      throw new Error("Invalid media.json format: missing 'media' array");
    }

    // Create backup
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupPath = `${mediaJsonFullPath}.backup.${timestamp}`;
    fs.writeFileSync(backupPath, mediaJsonContent);
    console.log(`\n✅ Backup created: ${backupPath}\n`);

    // Find items needing migration
    const itemsToMigrate = [];
    const itemsAlreadyCorrect = [];

    for (const mediaItem of mediaData.media) {
      if (!mediaItem.publicId) {
        console.warn(`⚠️  Skipping item without publicId: ${mediaItem.id || "unknown"}`);
        continue;
      }

      if (mediaItem.publicId.startsWith(TARGET_PREFIX)) {
        itemsAlreadyCorrect.push(mediaItem);
      } else {
        itemsToMigrate.push(mediaItem);
      }
    }

    console.log(`Found ${itemsAlreadyCorrect.length} items already in correct format`);
    console.log(`Found ${itemsToMigrate.length} items needing migration\n`);

    if (itemsToMigrate.length === 0) {
      console.log("✅ No files need migration. All files are already in the correct format!");
      return;
    }

    // Migrate each item
    const oldPublicIds = [];
    const migrationResults = [];

    for (let i = 0; i < itemsToMigrate.length; i++) {
      const mediaItem = itemsToMigrate[i];
      const oldPublicId = mediaItem.publicId;
      const resourceType = detectResourceType(mediaItem);

      console.log(`\n[${i + 1}/${itemsToMigrate.length}] Migrating: ${mediaItem.id || "unknown"}`);
      console.log(`  Old path: ${oldPublicId}`);

      try {
        // Extract path segment after tenant name
        const pathSegment = extractPathSegment(oldPublicId, tenantUsernameStr);
        const newPublicId = `${TARGET_PREFIX}${pathSegment}`;

        console.log(`  New path: ${newPublicId}`);

        // Fetch existing asset
        const existingAsset = await cloudinary.api.resource(oldPublicId, {
          resource_type: resourceType,
        });

        console.log(`  Found asset: ${existingAsset.secure_url}`);

        // Copy to new location
        const uploadResult = await cloudinary.uploader.upload(existingAsset.secure_url, {
          public_id: newPublicId,
          resource_type: resourceType,
          overwrite: false,
          invalidate: true,
        });

        console.log(`  ✅ Copied successfully`);

        // Update media object
        mediaItem.publicId = uploadResult.public_id;
        mediaItem.url = uploadResult.secure_url || uploadResult.url;
        mediaItem.version = uploadResult.version;

        // Update bucket (folder path)
        const bucketPath = newPublicId.substring(0, newPublicId.lastIndexOf("/"));
        mediaItem.bucket = bucketPath;

        // Preserve other fields (assetId, width, height, format, bytes, etc.)
        // These are already in the mediaItem, so we keep them

        oldPublicIds.push(oldPublicId);
        migrationResults.push({
          id: mediaItem.id,
          oldPublicId,
          newPublicId,
          success: true,
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`  ❌ Failed to migrate: ${errorMessage}`);
        migrationResults.push({
          id: mediaItem.id,
          oldPublicId,
          success: false,
          error: errorMessage,
        });
      }
    }

    // Write updated media.json
    console.log(`\n\n=== Writing Updated media.json ===`);
    fs.writeFileSync(mediaJsonFullPath, JSON.stringify(mediaData, null, 2));
    console.log(`✅ Updated: ${mediaJsonFullPath}`);

    // Write state file
    const stateFile = {
      tenantUsername: tenantUsernameStr,
      oldPublicIds,
      migratedAt: new Date().toISOString(),
      migrationResults,
    };

    const stateFilePath = path.join(
      process.cwd(),
      "scripts",
      `${tenantUsernameStr}-migration-old-files.json`,
    );
    fs.writeFileSync(stateFilePath, JSON.stringify(stateFile, null, 2));
    console.log(`✅ State file created: ${stateFilePath}`);

    // Print summary
    console.log(`\n\n=== Migration Summary ===`);
    console.log(`Total items: ${mediaData.media.length}`);
    console.log(`Already correct: ${itemsAlreadyCorrect.length}`);
    console.log(`Migrated: ${migrationResults.filter((r) => r.success).length}`);
    console.log(`Failed: ${migrationResults.filter((r) => !r.success).length}`);
    console.log(`\nOld publicIds to delete: ${oldPublicIds.length}`);
    console.log(`State file: ${stateFilePath}`);
    console.log(`\n✅ Migration complete!`);
    console.log(`\nNext steps:`);
    console.log(`1. Verify the updated media.json file`);
    console.log(`2. Test locally and in production`);
    console.log(`3. After verification, run delete-migrated-old-media.mjs to delete old files`);
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  }
}

migrateMedia().catch(console.error);
