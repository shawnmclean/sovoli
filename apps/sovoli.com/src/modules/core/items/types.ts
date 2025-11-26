import type { Media } from "../media/types";
import { z } from "zod";

export interface CategoryDefinition {
  id: string;
  name: string;
  gpcCode?: string;
  gpcDescription?: string;
  parentId?: string;
  children?: CategoryDefinition[];
}

// Zod schema for CategoryDefinition (recursive)
export const categoryDefinitionSchema: z.ZodType<CategoryDefinition> = z.lazy(
  () =>
    z.object({
      id: z.string(),
      name: z.string(),
      gpcCode: z.string().optional(),
      gpcDescription: z.string().optional(),
      parentId: z.string().optional(),
      children: z.array(categoryDefinitionSchema).optional(),
    }),
);

export interface ItemCategory {
  id: string;
  name: string;
  parent?: ItemCategory; // recursive chain
}

export interface Item {
  id: string; // Global ID, like Amazon ASIN
  name: string; // e.g., "Nursery Year 1 Mathematics Book"
  description?: string;
  category: ItemCategory;
  brand?: string; // e.g., Oxford, Sovoli
  modelNumber?: string; // if applicable

  attributes?: Record<string, string>; // {"subject": "Math", "grade": "Nursery Y1"}
  tags?: string[]; // ["nursery", "booklist", "math"]

  unitLabel?: string; // e.g., "set", "piece", "pack"
  dimensions?: Dimensions; // physical info (optional)
  weightInGrams?: number;

  media?: Media[];
}

interface Dimensions {
  lengthCm: number;
  widthCm: number;
  heightCm: number;
}

// Zod schema for Dimensions
const dimensionsSchema = z.object({
  lengthCm: z.number(),
  widthCm: z.number(),
  heightCm: z.number(),
});

// Zod schema for Media (supports images, videos, PDFs, documents, and other file types)
const mediaSchema = z.object({
  type: z
    .enum([
      "image",
      "video",
      "pdf",
      "document",
      "spreadsheet",
      "presentation",
      "audio",
    ])
    .default("image"),
  category: z
    .enum([
      "environment",
      "classroom",
      "activities",
      "events",
      "awards",
      "default",
    ])
    .optional(),
  url: z.string(),
  caption: z.string().optional(),
  alt: z.string().optional(),
  assetId: z.string().optional(),
  publicId: z.string(),
  bucket: z.string().optional(),
  id: z.string().optional(),
  path: z.string().nullable().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  format: z.string().optional(),
  bytes: z.number().optional(),
  version: z.number().optional(),
  uploadedAt: z.string().optional(),
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

// Zod schema for Item (used for parsing JSON files where category is stored as string ID)
// The category will be hydrated to ItemCategory when loaded
export const itemJsonSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  category: z.string(), // Category ID in JSON, will be hydrated to ItemCategory
  brand: z.string().optional(),
  modelNumber: z.string().optional(),
  attributes: z.record(z.string(), z.string()).optional(),
  tags: z.array(z.string()).optional(),
  unitLabel: z.string().optional(),
  dimensions: dimensionsSchema.optional(),
  weightInGrams: z.number().optional(),
  media: z.array(mediaSchema).optional(),
  // Legacy support: also accept 'photos' in JSON for backward compatibility
  photos: z.array(mediaSchema).optional(),
});

/**
 * A policy-defined set of items that can be used to filter items.
 * ie. Used for "Hurricane Mellissa Building Repair Needs"
 */
export interface ItemTagSet {
  id: string;
  name: string;
  description?: string;
  items: Item[];
}
