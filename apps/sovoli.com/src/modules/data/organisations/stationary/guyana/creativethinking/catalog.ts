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
    createCatalogItem("supply-crayola-crayons-fat", { GYD: 1200, USD: 6 }),
    createCatalogItem("supply-crayola-play-dough", { GYD: 1800, USD: 9 }),
    createCatalogItem("supply-art-book", { GYD: 800, USD: 4 }),
    createCatalogItem("supply-building-blocks", { GYD: 2500, USD: 12.5 }),
    createCatalogItem("supply-paint-set", { GYD: 1500, USD: 7.5 }),
    createCatalogItem("supply-card-board-sheet", { GYD: 300, USD: 1.5 }),
    createCatalogItem("supply-glue", { GYD: 400, USD: 2 }),
    createCatalogItem("supply-hand-sanitizer", { GYD: 600, USD: 3 }),
    createCatalogItem("supply-paper-towel", { GYD: 500, USD: 2.5 }),
    createCatalogItem("supply-liquid-soap", { GYD: 700, USD: 3.5 }),
    createCatalogItem("supply-fat-pencil", { GYD: 200, USD: 1 }),
    createCatalogItem("supply-single-line-book", { GYD: 400, USD: 2 }),
    createCatalogItem("supply-pack-letters", { GYD: 1000, USD: 5 }),
    createCatalogItem("supply-pack-numbers", { GYD: 1000, USD: 5 }),
    createCatalogItem("supply-exercise-book", { GYD: 600, USD: 3 }),
    createCatalogItem("supply-drawing-book", { GYD: 800, USD: 4 }),
    createCatalogItem("supply-double-line-book", { GYD: 600, USD: 3 }),
    createCatalogItem("supply-pencils", { GYD: 300, USD: 1.5 }),
    createCatalogItem("supply-soap", { GYD: 400, USD: 2 }),
    createCatalogItem("supply-bounty-tissue", { GYD: 800, USD: 4 }),
  ].filter((item): item is CatalogItem => item !== null),
};
