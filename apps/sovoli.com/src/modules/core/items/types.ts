import type { Photo } from "../photos/types";

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

type ItemCategory =
  | "book"
  | "uniform"
  | "material"
  | "equipment"
  | "tool"
  | "furniture"
  | "electronics"
  | "hygiene"
  | "food"
  | "service"
  | "other";

interface Dimensions {
  lengthCm: number;
  widthCm: number;
  heightCm: number;
}
