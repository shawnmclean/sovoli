import type { Item } from "~/modules/core/items/types";
import { hydrateCategory } from "./categories";

export const FACILITY_SUPPLIES_ITEMS: Item[] = [
  {
    id: "supply-cleanup-kit",
    name: "Disaster Cleanup Kit",
    category: hydrateCategory("facility"),
    tags: ["relief", "cleaning", "sanitation"],
    unitLabel: "kit",
    description:
      "Bundle of mops, disinfectant, gloves, and safety gear for post-disaster cleanup.",
  },
  {
    id: "relief-cleaning-cloths",
    name: "Cleaning Cloths / Towels",
    category: hydrateCategory("facility"),
    tags: ["relief", "cleaning"],
    unitLabel: "pack",
  },
  {
    id: "relief-cleaning-products",
    name: "Cleaning Products",
    category: hydrateCategory("facility"),
    tags: ["relief", "cleaning", "sanitation"],
  },
  {
    id: "relief-garbage-bags",
    name: "Garbage Bags",
    category: hydrateCategory("facility"),
    tags: ["relief", "cleaning", "waste"],
    unitLabel: "roll",
  },
  {
    id: "relief-storage-bins",
    name: "Storage Bins",
    category: hydrateCategory("facility"),
    tags: ["relief", "storage", "organization"],
  },
  {
    id: "relief-water-storage-containers",
    name: "Buckets / Pans (Water Storage)",
    category: hydrateCategory("facility"),
    unitLabel: "unit",
    tags: ["relief", "water", "storage"],
    description:
      "Heavy-duty buckets and pans for transporting and storing water.",
  },
  {
    id: "relief-safety-gloves",
    name: "Work Gloves",
    category: hydrateCategory("safety"),
    unitLabel: "pair",
    tags: ["relief", "cleanup", "protective-gear"],
  },
  {
    id: "relief-igloo-cooler",
    name: "Igloo Cooler",
    category: hydrateCategory("facility"),
    unitLabel: "cooler",
    tags: ["relief", "storage", "cold-chain"],
    description:
      "Insulated cooler for storing ice, water, or perishable relief items.",
  },
  {
    id: "relief-mops-brooms",
    name: "Mops / Brooms",
    category: hydrateCategory("facility"),
    unitLabel: "set",
    tags: ["relief", "cleanup", "sanitation"],
  },
  {
    id: "relief-temporary-sanitation-system",
    name: "Temporary Sanitation System",
    category: hydrateCategory("facility"),
    unitLabel: "kit",
    tags: ["relief", "sanitation", "infrastructure"],
    description:
      "Portable sanitation setup for temporary shelters and emergency deployments.",
  },
  {
    id: "relief-water-purification-kit",
    name: "Water Purification Kit",
    category: hydrateCategory("facility"),
    unitLabel: "kit",
    tags: ["relief", "water", "sanitation"],
    description:
      "Filters, tablets, and containers to purify drinking water on site.",
  },
];
