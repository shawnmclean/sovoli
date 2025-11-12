import type { Item } from "~/modules/core/items/types";

export const FACILITY_SUPPLIES_ITEMS: Item[] = [
  {
    id: "supply-cleanup-kit",
    name: "Disaster Cleanup Kit",
    category: "facility-supplies",
    tags: ["relief", "cleaning", "sanitation"],
    unitLabel: "kit",
    description:
      "Bundle of mops, disinfectant, gloves, and safety gear for post-disaster cleanup.",
  },
  {
    id: "relief-cleaning-cloths",
    name: "Cleaning Cloths / Towels",
    category: "facility-supplies",
    tags: ["relief", "cleaning"],
    unitLabel: "pack",
  },
  {
    id: "relief-cleaning-products",
    name: "Cleaning Products",
    category: "facility-supplies",
    tags: ["relief", "cleaning", "sanitation"],
  },
  {
    id: "relief-garbage-bags",
    name: "Garbage Bags",
    category: "facility-supplies",
    tags: ["relief", "cleaning", "waste"],
    unitLabel: "roll",
  },
  {
    id: "relief-storage-bins",
    name: "Storage Bins",
    category: "facility-supplies",
    tags: ["relief", "storage", "organization"],
  },
];
