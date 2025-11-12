import type { Item } from "~/modules/core/items/types";

export const EQUIPMENT_ITEMS: Item[] = [
  {
    id: "supply-seamstress-scissors",
    name: "Seamstress Scissors",
    category: "equipment",
    tags: ["sewing", "scissors"],
  },
  {
    id: "supply-sewing-pins",
    name: "Sewing Pins",
    category: "equipment",
    tags: ["sewing", "pins"],
  },
  {
    id: "supply-pin-cushion",
    name: "Pin Cushion",
    category: "equipment",
    tags: ["sewing", "pin-cushion"],
  },
  {
    id: "supply-tape-measure",
    name: "Tape Measure",
    category: "equipment",
    tags: ["sewing", "measuring", "tape"],
  },
  {
    id: "supply-machine-needles-14",
    name: "No. 14 Machine Needles",
    category: "equipment",
    tags: ["sewing", "needle", "machine"],
  },
  {
    id: "supply-hand-needle",
    name: "Hand Needle",
    category: "equipment",
    tags: ["sewing", "needle", "hand"],
  },
  {
    id: "equipment-ac-unit",
    name: "Air Conditioning Unit",
    category: "equipment",
    tags: ["facilities", "classroom", "cooling"],
    unitLabel: "unit",
    description:
      "Standard split-system AC unit suitable for classroom environments.",
  },
  {
    id: "equipment-portable-generator",
    name: "Portable Generator",
    category: "equipment",
    tags: ["relief", "power", "facilities"],
    unitLabel: "unit",
    description:
      "5 kW portable generator to provide backup electricity during recovery efforts.",
  },
  {
    id: "relief-chainsaw",
    name: "Chainsaw (Long Blade)",
    category: "equipment",
    tags: ["relief", "building", "power-tool"],
  },
  {
    id: "relief-tents",
    name: "Tents",
    category: "equipment",
    tags: ["relief", "shelter"],
  },
];
