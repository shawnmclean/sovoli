import { z } from "zod";
import type { Media, MediaType } from "~/modules/core/media/types";

/**
 * Zod schema for Media type validation
 * Used for parsing media.json files
 */
const mediaJsonSchema = z.object({
  // Required fields
  id: z.string().min(1, "Media id is required"),
  type: z.enum([
    "image",
    "video",
    "pdf",
    "document",
    "spreadsheet",
    "presentation",
    "audio",
  ]) as z.ZodType<MediaType>,
  url: z.string().url("Media url must be a valid URL"),
  publicId: z.string().min(1, "Media publicId is required"),

  // Optional fields
  caption: z.string().optional(),
  alt: z.string().optional(),
  assetId: z.string().optional(),
  bucket: z.string().optional(),
  path: z.string().nullable().optional(),
  format: z.string().optional(),
  bytes: z.number().optional(),
  version: z.number().optional(),
  uploadedAt: z.string().optional(),

  // Visual media fields
  width: z.number().optional(),
  height: z.number().optional(),

  // Video-specific fields
  duration: z.number().optional(),
  videoCodec: z.string().optional(),
  audioCodec: z.string().optional(),
  fps: z.number().optional(),
  bitrate: z.number().optional(),
  posterUrl: z.string().optional(),

  // Document-specific fields
  pages: z.number().optional(),

  // Audio-specific fields
  audioDuration: z.number().optional(),
  audioBitrate: z.number().optional(),
});

/**
 * Zod schema for media.json file structure
 */
const mediaModuleJsonSchema = z.object({
  media: z.array(mediaJsonSchema),
});

/**
 * Error class for media parsing errors
 */
export class MediaNotFoundError extends Error {
  constructor(
    public readonly mediaId: string,
    public readonly context?: string,
  ) {
    const contextStr = context ? ` Referenced in ${context}.` : "";
    super(`Media with id "${mediaId}" not found.${contextStr}`);
    this.name = "MediaNotFoundError";
  }
}

/**
 * Error class for duplicate media ID errors
 */
export class DuplicateMediaIdError extends Error {
  constructor(public readonly mediaId: string) {
    super(`Duplicate media id "${mediaId}" found in media.json.`);
    this.name = "DuplicateMediaIdError";
  }
}

/**
 * Type for the parsed media map
 */
export type MediaMap = Map<string, Media>;

/**
 * Parses a media.json file and creates a Map for O(1) lookups.
 * Validates that all media have unique IDs and required fields.
 *
 * @param jsonData - The parsed JSON data from the media.json file
 * @returns Map<string, Media> for efficient lookups by ID
 * @throws DuplicateMediaIdError if any media IDs are duplicated
 * @throws ZodError if JSON structure is invalid
 */
export function parseMediaModule(jsonData: unknown): MediaMap {
  // Validate JSON structure
  const validated = mediaModuleJsonSchema.parse(jsonData);

  const mediaMap: MediaMap = new Map();

  for (const mediaJson of validated.media) {
    // Check for duplicate IDs
    if (mediaMap.has(mediaJson.id)) {
      throw new DuplicateMediaIdError(mediaJson.id);
    }

    // Add to map (id is guaranteed to exist from validation)
    const media: Media = {
      ...mediaJson,
      // Ensure id is set (TypeScript knows it exists from validation)
      id: mediaJson.id,
    };

    mediaMap.set(mediaJson.id, media);
  }

  return mediaMap;
}

/**
 * Helper function to get a media item by ID with context for error messages.
 * Throws MediaNotFoundError if not found.
 *
 * @param mediaMap - The media map from parseMediaModule
 * @param mediaId - The ID of the media to retrieve
 * @param context - Optional context for error messages (e.g., "program 'pre-nursery'")
 * @returns The Media object
 * @throws MediaNotFoundError if the media ID is not found
 */
export function getMediaById(
  mediaMap: MediaMap,
  mediaId: string,
  context?: string,
): Media {
  const media = mediaMap.get(mediaId);
  if (!media) {
    throw new MediaNotFoundError(mediaId, context);
  }
  return media;
}

/**
 * Helper function to get multiple media items by IDs.
 * Throws MediaNotFoundError if any ID is not found.
 *
 * @param mediaMap - The media map from parseMediaModule
 * @param mediaIds - Array of media IDs to retrieve
 * @param context - Optional context for error messages
 * @returns Array of Media objects
 * @throws MediaNotFoundError if any media ID is not found
 */
export function getMediaByIds(
  mediaMap: MediaMap,
  mediaIds: string[],
  context?: string,
): Media[] {
  return mediaIds.map((id) => getMediaById(mediaMap, id, context));
}

/**
 * Helper function to optionally get a media item by ID.
 * Returns undefined if ID is not provided, throws if ID is provided but not found.
 *
 * @param mediaMap - The media map from parseMediaModule
 * @param mediaId - The optional ID of the media to retrieve
 * @param context - Optional context for error messages
 * @returns The Media object or undefined
 * @throws MediaNotFoundError if the media ID is provided but not found
 */
export function getMediaByIdOptional(
  mediaMap: MediaMap,
  mediaId: string | undefined,
  context?: string,
): Media | undefined {
  if (!mediaId) return undefined;
  return getMediaById(mediaMap, mediaId, context);
}
