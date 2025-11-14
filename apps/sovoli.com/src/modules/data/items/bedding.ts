import type { Item } from "~/modules/core/items/types";

export const BEDDING_ITEMS: Item[] = [
  {
    id: "relief-sheets",
    name: "Sheets",
    category: "bedding",
    tags: ["relief", "bedding"],
  },
  {
    id: "relief-bed-linens-set",
    name: "Bed Linens / Pads Set",
    category: "bedding",
    unitLabel: "set",
    tags: ["relief", "bedding", "linens"],
    description:
      "Complete bed linen bundle with pads and pillowcases for emergency shelters.",
  },
  {
    id: "relief-bath-linens",
    name: "Bath Linens",
    category: "bedding",
    unitLabel: "set",
    tags: ["relief", "bedding", "towels"],
  },
  {
    id: "relief-bed-cots",
    name: "Bed Cots",
    category: "bedding",
    unitLabel: "cot",
    tags: ["relief", "shelter", "sleep"],
  },
  {
    id: "relief-mattresses",
    name: "Mattresses",
    category: "bedding",
    unitLabel: "mattress",
    tags: ["relief", "sleep", "comfort"],
  },
  {
    id: "relief-sleeping-bags",
    name: "Sleeping Bags",
    category: "bedding",
    tags: ["relief", "shelter", "bedding"],
  },
];
