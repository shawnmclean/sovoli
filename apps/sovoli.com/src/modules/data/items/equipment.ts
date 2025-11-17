import type { Item } from "~/modules/core/items/types";
import { hydrateCategory } from "./categories";

export const EQUIPMENT_ITEMS: Item[] = [
  {
    id: "supply-seamstress-scissors",
    name: "Seamstress Scissors",
    category: hydrateCategory("tools"),
    tags: ["sewing", "scissors"],
  },
  {
    id: "supply-sewing-pins",
    name: "Sewing Pins",
    category: hydrateCategory("tools"),
    tags: ["sewing", "pins"],
  },
  {
    id: "supply-pin-cushion",
    name: "Pin Cushion",
    category: hydrateCategory("tools"),
    tags: ["sewing", "pin-cushion"],
  },
  {
    id: "supply-tape-measure",
    name: "Tape Measure",
    category: hydrateCategory("tools"),
    tags: ["sewing", "measuring", "tape"],
  },
  {
    id: "supply-machine-needles-14",
    name: "No. 14 Machine Needles",
    category: hydrateCategory("tools"),
    tags: ["sewing", "needle", "machine"],
  },
  {
    id: "supply-hand-needle",
    name: "Hand Needle",
    category: hydrateCategory("tools"),
    tags: ["sewing", "needle", "hand"],
  },
  {
    id: "equipment-ac-unit",
    name: "Air Conditioning Unit",
    category: hydrateCategory("electrical"),
    tags: ["facilities", "classroom", "cooling"],
    unitLabel: "unit",
    description:
      "Standard split-system AC unit suitable for classroom environments.",
  },
  {
    id: "equipment-portable-generator",
    name: "Portable Generator",
    category: hydrateCategory("electrical"),
    tags: ["relief", "power", "facilities"],
    unitLabel: "unit",
    description:
      "5 kW portable generator to provide backup electricity during recovery efforts.",
  },
  {
    id: "relief-chainsaw",
    name: "Chainsaw (Long Blade)",
    category: hydrateCategory("power-tools"),
    tags: ["relief", "building", "power-tool"],
  },
  {
    id: "relief-tents",
    name: "Tents",
    category: hydrateCategory("hardware"),
    tags: ["relief", "shelter"],
  },
  {
    id: "relief-water-boots",
    name: "Water Boots",
    category: hydrateCategory("safety"),
    unitLabel: "pair",
    tags: ["relief", "protective-gear", "footwear"],
  },
  {
    id: "relief-basic-hand-tools",
    name: "Basic Hand Tool Kit",
    category: hydrateCategory("toolkits"),
    tags: ["relief", "building", "tooling"],
    unitLabel: "kit",
    description:
      "Essential hand tools including hammers, screwdrivers, wrenches, and measuring tools for relief and repair work.",
  },
];
