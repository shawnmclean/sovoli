import type { ItemCategory } from "./types";

/**
 * Convert an `ItemCategory` value (e.g. "facility-supplies") into a human readable
 * label such as "Facility Supplies".
 */
export function formatItemCategoryLabel(category: ItemCategory): string {
  return category
    .split("-")
    .map((segment) => {
      if (segment.length === 0) {
        return segment;
      }
      const [first, ...rest] = segment;
      return `${first.toUpperCase()}${rest.join("")}`;
    })
    .join(" ");
}
