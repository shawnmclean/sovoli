import type { Item } from "~/modules/core/items/types";
import { itemJsonSchema } from "~/modules/core/items/types";
import { BOOKS } from "./book";
import { FOOD_ITEMS } from "./food";
import { HARDWARE_ITEMS } from "./hardware";
import { HYGIENE_ITEMS } from "./hygiene";
import { OTHER_ITEMS } from "./other";
import { STATIONERY_ITEMS } from "./stationery";
import { BUILDING_ITEMS } from "./building";
import { hydrateCategory } from "./categories";
import plumbingHeatingVentilationAirConditioningData from "./library/plumbingHeatingVentilationAirConditioning.json";

// Parse and hydrate items from JSON files
function hydrateItemsFromJson(jsonData: unknown[]): Item[] {
  const parsedItems = itemJsonSchema.array().parse(jsonData);
  return parsedItems.map((item) => ({
    ...item,
    category: hydrateCategory(item.category),
  }));
}

const PLUMBING_HEATING_VENTILATION_AIR_CONDITIONING_ITEMS =
  hydrateItemsFromJson(plumbingHeatingVentilationAirConditioningData);

export const ALL_ITEMS: Item[] = [
  ...BOOKS,
  ...PLUMBING_HEATING_VENTILATION_AIR_CONDITIONING_ITEMS,
  // ...BUILDING_ITEMS,
  // ...STATIONERY_ITEMS,
  // ...HYGIENE_ITEMS,
  // ...HARDWARE_ITEMS,
  // ...EQUIPMENT_ITEMS,
  // ...FOOD_ITEMS,
  // ...OTHER_ITEMS,
];

export function findItemById(id: string): Item | undefined {
  return ALL_ITEMS.find((item) => item.id === id);
}

export function findItemsByIds(ids: string[]): Item[] {
  return ALL_ITEMS.filter((item) => ids.includes(item.id));
}
