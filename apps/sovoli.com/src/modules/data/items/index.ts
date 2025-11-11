import { BOOKS } from "./books";
import { RELIEF_SUPPLIES } from "./relief-supplies";
import { SUPPLIES } from "./supplies";
import type { Item } from "~/modules/core/items/types";

export const ALL_ITEMS: Item[] = [...BOOKS, ...SUPPLIES, ...RELIEF_SUPPLIES];

export function findItemById(id: string): Item | undefined {
  return ALL_ITEMS.find((item) => item.id === id);
}

export function findItemsByIds(ids: string[]): Item[] {
  return ALL_ITEMS.filter((item) => ids.includes(item.id));
}

export { BOOKS, SUPPLIES, RELIEF_SUPPLIES };
