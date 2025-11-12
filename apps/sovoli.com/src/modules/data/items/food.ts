import type { Item } from "~/modules/core/items/types";

export const FOOD_ITEMS: Item[] = [
  {
    id: "relief-canned-goods",
    name: "Canned Goods",
    category: "food",
    tags: ["relief", "food", "non-perishable"],
  },
  {
    id: "relief-rice",
    name: "Rice",
    category: "food",
    tags: ["relief", "food", "non-perishable"],
  },
  {
    id: "relief-beans",
    name: "Beans",
    category: "food",
    tags: ["relief", "food", "non-perishable", "protein"],
  },
  {
    id: "relief-bottled-water",
    name: "Bottled Water",
    category: "food",
    unitLabel: "case",
    tags: ["relief", "food", "hydration"],
  },
  {
    id: "relief-baby-formula",
    name: "Baby Formula",
    category: "food",
    tags: ["relief", "food", "infant"],
  },
  {
    id: "relief-non-perishable-foods",
    name: "Non-perishable Foods",
    category: "food",
    tags: ["relief", "food", "non-perishable"],
  },
];
