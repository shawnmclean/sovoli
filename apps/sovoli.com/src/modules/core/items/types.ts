import type { Photo } from "../photos/types";

export interface CategoryDefinition {
  id: string;
  name: string;
  parentId?: string;
  children?: CategoryDefinition[];
}

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
