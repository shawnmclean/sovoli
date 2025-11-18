import type { Photo } from "../photos/types";
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

  photos?: Photo[];
}

interface Dimensions {
  lengthCm: number;
  widthCm: number;
  heightCm: number;
}

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
