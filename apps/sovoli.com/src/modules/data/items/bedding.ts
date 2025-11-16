import type { Item } from "~/modules/core/items/types";
import { hydrateCategory } from "./categories";

export const BEDDING_ITEMS: Item[] = [
  {
    id: "relief-sheets",
    name: "Sheets",
    category: hydrateCategory("bedding"),
    tags: ["relief", "bedding"],
  },
  {
    id: "relief-bed-linens-set",
    name: "Bed Linens / Pads Set",
    category: hydrateCategory("bedding"),
    unitLabel: "set",
    tags: ["relief", "bedding", "linens"],
    description:
      "Complete bed linen bundle with pads and pillowcases for emergency shelters.",
  },
  {
    id: "relief-bath-linens",
    name: "Bath Linens",
    category: hydrateCategory("bedding"),
    unitLabel: "set",
    tags: ["relief", "bedding", "towels"],
  },
  {
    id: "relief-bed-cots",
    name: "Bed Cots",
    category: hydrateCategory("bedding"),
    unitLabel: "cot",
    tags: ["relief", "shelter", "sleep"],
  },
  {
    id: "relief-mattresses",
    name: "Mattresses",
    category: hydrateCategory("mattress"),
    unitLabel: "mattress",
    tags: ["relief", "sleep", "comfort"],
  },
  {
    id: "relief-sleeping-bags",
    name: "Sleeping Bags",
    category: hydrateCategory("bedding"),
    tags: ["relief", "shelter", "bedding"],
  },
];
