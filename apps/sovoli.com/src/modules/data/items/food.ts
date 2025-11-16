import type { Item } from "~/modules/core/items/types";
import { hydrateCategory } from "./categories";

export const FOOD_ITEMS: Item[] = [
  {
    id: "relief-canned-goods",
    name: "Canned Goods",
    category: hydrateCategory("food"),
    tags: ["relief", "food", "non-perishable"],
  },
  {
    id: "relief-rice",
    name: "Rice",
    category: hydrateCategory("food"),
    tags: ["relief", "food", "non-perishable"],
  },
  {
    id: "relief-beans",
    name: "Beans",
    category: hydrateCategory("food"),
    tags: ["relief", "food", "non-perishable", "protein"],
  },
  {
    id: "relief-bottled-water",
    name: "Bottled Water",
    category: hydrateCategory("food"),
    unitLabel: "case",
    tags: ["relief", "food", "hydration"],
  },
  {
    id: "relief-baby-formula",
    name: "Baby Formula",
    category: hydrateCategory("food"),
    tags: ["relief", "food", "infant"],
  },
  {
    id: "relief-non-perishable-foods",
    name: "Non-perishable Foods",
    category: hydrateCategory("food"),
    tags: ["relief", "food", "non-perishable"],
  },
];
