import type { ItemCategory } from "./types";

/**
 * Convert an `ItemCategory` object into a human readable label.
 * Walks up the parent chain to build a full category path.
 */
export function formatItemCategoryLabel(category: ItemCategory): string {
  const names: string[] = [];
  let current: ItemCategory | undefined = category;
  while (current) {
    names.unshift(current.name);
    current = current.parent;
  }
  return names.join(" / ");
}
