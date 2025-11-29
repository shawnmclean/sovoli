/**
 * Upload Media to Cloudinary
 *
 * This script uploads images or videos to Cloudinary and outputs a JSON object
 * that can be added to projects.json, needs.json, or photos.ts files.
 *
 * Usage:
 *   pnpm with-env node scripts/upload-media.mjs <file-path> <org-path>
 *
 * Examples:
 *   # Upload a video (absolute path)
 *   pnpm with-env node scripts/upload-media.mjs "E:\Developers\sovoli\tmp\video.mp4" "o/cove-primary/projects"
 *
 *   # Upload an image (relative path from workspace root)
 *   pnpm with-env node scripts/upload-media.mjs "..\..\..\tmp\image.jpg" "o/cove-primary/photos"
 *
 *   # Upload to needs folder
 *   pnpm with-env node scripts/upload-media.mjs "..\..\..\tmp\photo.png" "o/cove-primary/needs"
 *
 * Arguments:
 *   <file-path>  - Path to the media file (image or video). Can be absolute or relative.
 *   <org-path>   - Cloudinary folder path (e.g., "o/cove-primary/projects")
 *
 * Output:
 *   - Full Cloudinary API response
 *   - Formatted Media object ready to copy into JSON/TS files
 *
 * Supported formats:
 *   Videos: .mp4, .mov, .webm
 *   Images: All other image formats (jpg, png, webp, etc.)
 */

import { v2 as cloudinary } from "cloudinary";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

// Load environment variables from root .env file
dotenv.config({ path: path.join(process.cwd(), "../../../.env") });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get command line arguments
const [filePath, orgPath] = process.argv.slice(2);

if (!filePath || !orgPath) {
  console.error("Usage: node upload-media.mjs <file-path> <org-path>");
  console.error(
    'Example: node upload-media.mjs "../../../tmp/video.mp4" "o/cove-primary/projects"',
  );
  process.exit(1);
}

// TypeScript-friendly: ensure these are strings after the check
const filePathStr = filePath;
const orgPathStr = orgPath;

async function uploadMedia() {
  try {
    // Resolve file path - normalize and check existence
    let fullPath = path.isAbsolute(filePathStr)
      ? filePathStr
      : path.resolve(filePathStr);

    // If file doesn't exist, try resolving from workspace root
    if (!fs.existsSync(fullPath)) {
      const workspaceRoot = path.resolve(process.cwd(), "../../../");
      const altPath = path.resolve(workspaceRoot, filePathStr);
      if (fs.existsSync(altPath)) {
        fullPath = altPath;
      }
    }

    if (!fs.existsSync(fullPath)) {
      throw new Error(`File not found: ${fullPath}`);
    }
    const resourceType =
      path.extname(fullPath).toLowerCase() === ".mp4" ||
      path.extname(fullPath).toLowerCase() === ".mov" ||
      path.extname(fullPath).toLowerCase() === ".webm"
        ? "video"
        : "image";

    console.log(`Uploading ${resourceType} from: ${fullPath}`);
    console.log(`To folder: ${orgPathStr}`);

    // Check file size - use upload_large for files over 100MB
    const fileStats = fs.statSync(fullPath);
    const fileSizeInMB = fileStats.size / (1024 * 1024);
    const useLargeUpload = fileSizeInMB > 100;

    if (useLargeUpload) {
      console.log(`File size: ${fileSizeInMB.toFixed(2)}MB - Using large file upload`);
    }

    const uploadOptions = {
      resource_type: resourceType,
      folder: orgPathStr,
      media_metadata: true,
    };

    // Use upload_large for large files (supports chunked uploads)
    // upload_large returns a stream, so we need to handle it with a callback
    // Set chunk_size to 20MB (20000000 bytes) to stay under the 100MB limit
    let result;
    if (useLargeUpload && resourceType === "video") {
      // For large videos, use smaller chunks and create a compressed version
      const largeUploadOptions = {
        ...uploadOptions,
        chunk_size: 10000000, // 10MB chunks (smaller to avoid limits)
        // Create a compressed version as eager transformation
        eager: [
          {
            quality: "auto:good", // Auto quality with good compression
            video_codec: "h264", // Use H.264 codec
            bit_rate: "1500k", // Limit bitrate to 1.5Mbps to reduce size significantly
            format: "mp4", // Ensure MP4 format
          },
        ],
        eager_async: false, // Process synchronously
      };
      console.log("Uploading large video with compression...");
      console.log("Note: A compressed version will be created automatically.");
      result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_large(fullPath, largeUploadOptions, (error, result) => {
          if (error) {
            reject(error);
          } else {
            // If eager transformation was created, use that instead
            if (result.eager && result.eager.length > 0) {
              const compressed = result.eager[0];
              console.log("Using compressed version from eager transformation");
              // Merge the compressed version data with the original result
              resolve({
                ...result,
                secure_url: compressed.secure_url || result.secure_url,
                url: compressed.url || result.url,
                format: compressed.format || result.format,
                bytes: compressed.bytes || result.bytes,
                width: compressed.width || result.width,
                height: compressed.height || result.height,
                duration: compressed.duration || result.duration,
              });
            } else {
              resolve(result);
            }
          }
        });
      });
    } else if (useLargeUpload) {
      // For large non-video files, just use chunking
      const largeUploadOptions = {
        ...uploadOptions,
        chunk_size: 20000000, // 20MB chunks
      };
      result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_large(fullPath, largeUploadOptions, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      });
    } else {
      result = await cloudinary.uploader.upload(fullPath, uploadOptions);
    }

    console.log("\n=== Full Cloudinary Response ===");
    console.log(JSON.stringify(result, null, 2));

    // Extract relevant fields for the Media type
    const mediaObject = {
      type: resourceType,
      url: result.secure_url || result.url || "",
      publicId: result.public_id || "",
      assetId: result.asset_id,
      bucket: orgPathStr,
      format: result.format,
      bytes: result.bytes,
      version: result.version,
      uploadedAt: result.created_at,
      width: result.width,
      height: result.height,
      ...(resourceType === "video" && {
        duration: result.duration,
        videoCodec: result.video?.codec,
        audioCodec: result.audio?.codec,
        fps: result.frame_rate,
        bitrate:
          typeof result.video?.bit_rate === "string"
            ? parseInt(result.video.bit_rate, 10)
            : result.video?.bit_rate || result.bit_rate,
        posterUrl:
          result.poster ||
          (result.public_id
            ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/so_0/${result.public_id}.jpg`
            : undefined),
      }),
      category: "default",
      caption: path.basename(fullPath),
      alt: path.basename(fullPath),
    };

    console.log("\n=== Media Object for JSON ===");
    console.log(JSON.stringify(mediaObject, null, 2));
  } catch (error) {
    console.error("Upload failed:", error);
    process.exit(1);
  }
}

uploadMedia().catch(console.error);
