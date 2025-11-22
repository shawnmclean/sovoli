import type { AmountByCurrency } from "../core/economics/types";
import type { Item } from "../core/items/types";

export interface CatalogOffer {
  id: string;
  item: Item;
  name?: string;
  attributes?: Record<string, string>;
  price: AmountByCurrency;
}

export interface CatalogModule {
  items: CatalogOffer[];
}
