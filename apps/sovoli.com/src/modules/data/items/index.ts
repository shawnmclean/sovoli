import type { Item } from "~/modules/core/items/types";
import { BOOKS } from "./book";
import { PLUMBING_HEATING_VENTILATION_AIR_CONDITIONING_ITEMS } from "./plumbingHeatingVentilationAirConditioning";
import { FOOD_ITEMS } from "./food";
import { HARDWARE_ITEMS } from "./hardware";
import { HYGIENE_ITEMS } from "./hygiene";
import { OTHER_ITEMS } from "./other";
import { STATIONERY_ITEMS } from "./stationery";
import { BUILDING_ITEMS } from "./building";

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
