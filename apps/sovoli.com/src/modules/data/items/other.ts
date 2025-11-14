import type { Item } from "~/modules/core/items/types";

export const OTHER_ITEMS: Item[] = [
  {
    id: "relief-insect-traps",
    name: "Insect Traps",
    category: "other",
    tags: ["relief", "health", "pest-control"],
  },
  {
    id: "relief-clothing",
    name: "Clothing",
    category: "other",
    unitLabel: "set",
    tags: ["relief", "apparel"],
  },
  {
    id: "relief-kitchen-utensils",
    name: "Kitchen Utensils",
    category: "other",
    unitLabel: "set",
    tags: ["relief", "kitchen"],
    description:
      "Pots, pans, and non-plastic disposables to prepare meals in shelters.",
  },
  {
    id: "relief-otc-drugs",
    name: "Over-the-Counter Drugs",
    category: "other",
    unitLabel: "kit",
    tags: ["relief", "medical"],
    description: "Pain relievers, cold medicine, and other OTC essentials.",
  },
  {
    id: "relief-portable-stoves",
    name: "Portable Stoves / Butane Burners",
    category: "other",
    unitLabel: "stove",
    tags: ["relief", "cooking", "kitchen"],
  },
  {
    id: "relief-rain-gear",
    name: "Rain Gear / Coats",
    category: "other",
    unitLabel: "set",
    tags: ["relief", "protective-gear", "weather"],
  },
];
