import type { Item } from "~/modules/core/items/types";
import { BEDDING_ITEMS } from "./bedding";
import { BOOKS } from "./book";
import { ELECTRONICS_ITEMS } from "./electronics";
import { EQUIPMENT_ITEMS } from "./equipment";
import { FACILITY_SUPPLIES_ITEMS } from "./facility-supplies";
import { FOOD_ITEMS } from "./food";
import { HARDWARE_ITEMS } from "./hardware";
import { HYGIENE_ITEMS } from "./hygiene";
import { OTHER_ITEMS } from "./other";
import { STATIONERY_ITEMS } from "./stationery";

export const ALL_ITEMS: Item[] = [
  ...BOOKS,
  ...STATIONERY_ITEMS,
  ...HYGIENE_ITEMS,
  ...FACILITY_SUPPLIES_ITEMS,
  ...HARDWARE_ITEMS,
  ...EQUIPMENT_ITEMS,
  ...ELECTRONICS_ITEMS,
  ...FOOD_ITEMS,
  ...BEDDING_ITEMS,
  ...OTHER_ITEMS,
];

export function findItemById(id: string): Item | undefined {
  return ALL_ITEMS.find((item) => item.id === id);
}

export function findItemsByIds(ids: string[]): Item[] {
  return ALL_ITEMS.filter((item) => ids.includes(item.id));
}

export {
  BEDDING_ITEMS,
  BOOKS,
  ELECTRONICS_ITEMS,
  EQUIPMENT_ITEMS,
  FACILITY_SUPPLIES_ITEMS,
  FOOD_ITEMS,
  HARDWARE_ITEMS,
  HYGIENE_ITEMS,
  OTHER_ITEMS,
  STATIONERY_ITEMS,
};
