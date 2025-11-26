/**
 * Unified Media type supporting images, videos, documents, and other file types from Cloudinary
 */

/** Visual media types that can be displayed in galleries */
export type VisualMediaType = "image" | "video";

/** Non-visual media types (documents, files, etc.) */
export type DocumentMediaType =
  | "pdf"
  | "document"
  | "spreadsheet"
  | "presentation";

/** Audio media types */
export type AudioMediaType = "audio";

/** All supported media types */
export type MediaType = VisualMediaType | DocumentMediaType | AudioMediaType;

/** Helper type to check if media is visual (can be shown in galleries) */
export type IsVisualMedia<T extends MediaType> = T extends VisualMediaType
  ? true
  : false;

export interface Media {
  /** Media type discriminator */
  type: MediaType;

  /** Category classification (optional for non-visual types like PDFs) */
  category?:
    | "environment"
    | "classroom"
    | "activities"
    | "events"
    | "awards"
    | "default";

  /** Direct URL to the media asset */
  url: string;

  /** Caption for the media */
  caption?: string;

  /** Alt text for accessibility (mainly for images/videos) */
  alt?: string;

  /** Cloudinary public ID (required for Cloudinary transformations) */
  publicId: string;

  // Cloudinary fields (auto-populated on upload)
  /** Cloudinary asset ID */
  assetId?: string;

  // Database fields for media assets
  /** Cloudinary bucket/folder */
  bucket?: string;

  /** Media asset ID */
  id?: string;

  /** Optional path */
  path?: string | null;

  /** File format (webp, jpg, mp4, pdf, etc.) */
  format?: string;

  /** File size in bytes */
  bytes?: number;

  /** Cloudinary version */
  version?: number;

  /** Upload timestamp */
  uploadedAt?: string;

  // Visual media fields (images and videos)
  /** Width in pixels (images and videos) */
  width?: number;

  /** Height in pixels (images and videos) */
  height?: number;

  // Video-specific fields
  /** Video duration in seconds */
  duration?: number;

  /** Video codec (e.g., "h264", "vp9") */
  videoCodec?: string;

  /** Audio codec (e.g., "aac", "mp3") */
  audioCodec?: string;

  /** Frames per second */
  fps?: number;

  /** Video bitrate */
  bitrate?: number;

  /** Video thumbnail/poster URL */
  posterUrl?: string;

  // Document-specific fields
  /** Number of pages (for PDFs and documents) */
  pages?: number;

  // Audio-specific fields
  /** Audio duration in seconds */
  audioDuration?: number;

  /** Audio bitrate */
  audioBitrate?: number;
}

/**
 * Type guard to check if media is visual (can be displayed in galleries)
 */
export function isVisualMedia(media: Media): media is Media & {
  type: VisualMediaType;
} {
  return media.type === "image" || media.type === "video";
}

/**
 * Helper to filter only visual media (images and videos) from a media array
 * Useful for gallery components that should exclude PDFs and other documents
 */
export function filterVisualMedia(
  media: Media[],
): (Media & { type: VisualMediaType })[] {
  return media.filter(isVisualMedia);
}
