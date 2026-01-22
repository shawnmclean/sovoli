import type { CatalogModule, CatalogOffer } from "~/modules/catalogs/types";
import type { AmountByCurrency } from "~/modules/core/economics/types";
import { findItemById } from "~/modules/data/items";

/**
 * Helper function to create a catalog item with pricing
 */
function createCatalogItem(
  id: string,
  price: AmountByCurrency,
  name?: string,
): CatalogOffer | null {
  const item = findItemById(id);
  if (!item) {
    console.warn(`Item with id "${id}" not found`);
    return null;
  }

  return {
    id,
    item,
    price,
    name,
  };
}

export const PHILS_HARDWARE_CATALOG: CatalogModule = {
  items: [
    // Doors and Building Materials
    createCatalogItem(
      "exterior-door-36x80",
      { JMD: 17117.75, USD: 107 },
      "36X80 PINE DOOR - 6 PANEL - BRAZIL- IBI",
    ),
  ].filter((item): item is CatalogOffer => item !== null),
};
