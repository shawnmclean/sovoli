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

export type ItemCategory =
  // 1. Academic Core
  | "book" // textbooks, workbooks, readers
  | "stationery" // pens, crayons, paper, art materials
  | "uniform" // clothing, shoes, badges
  | "equipment" // lab gear, sports equipment, musical instruments
  | "furniture" // desks, chairs, shelves, whiteboards

  // 2. Operations & Facilities
  | "facility-supplies" // cleaning agents, mops, garbage bins
  | "hardware" // construction & repair items (paint, nails, tools)
  | "electronics" // projectors, computers, tablets, printers, fans
  | "utilities" // lighting, plumbing, electrical fixtures

  // 3. Health & Hygiene
  | "hygiene" // soap, sanitizer, tissue, pads, disinfectant
  | "medical" // first-aid kits, thermometers, gloves

  // 4. Food & Nutrition
  | "kitchen" // pots, utensils, plates, gas stoves
  | "food" // dry goods, snacks, water, nutrition packs

  // 5. Accommodation & Comfort
  | "bedding" // sheets, pillows, mattresses
  | "laundry" // detergents, irons, laundry baskets
  | "appliances" // fans, fridges, water coolers (non-IT electronics)

  // 6. Services & Other
  | "service" // printing, transportation, maintenance, catering
  | "other"; // uncategorized or new additions

interface Dimensions {
  lengthCm: number;
  widthCm: number;
  heightCm: number;
}
