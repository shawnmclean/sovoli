import type { AmountByCurrency } from "../core/economics/types";
import type { Item } from "../core/items/types";

export interface CatalogItem {
  id: string;
  item: Item;
  name?: string;
  price: AmountByCurrency;
}

export interface CatalogModule {
  items: CatalogItem[];
}
