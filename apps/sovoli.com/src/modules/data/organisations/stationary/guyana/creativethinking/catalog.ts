import type { CatalogModule, CatalogItem } from "~/modules/catalogs/types";
import { findItemById } from "~/modules/data/items";
import type { AmountByCurrency } from "~/modules/core/economics/types";

/**
 * Helper function to create a catalog item with pricing
 */
function createCatalogItem(
  id: string,
  price: AmountByCurrency,
): CatalogItem | null {
  const item = findItemById(id);
  if (!item) {
    console.warn(`Item with id "${id}" not found`);
    return null;
  }

  return {
    id,
    item,
    price,
  };
}

export const CREATIVE_THINKING_STATIONERY_HUB_CATALOG: CatalogModule = {
  items: [
    // Art and Creative Supplies
    createCatalogItem("supply-crayola-crayons-fat", { GYD: 1200, USD: 6 }),
  ].filter((item): item is CatalogItem => item !== null),
};
