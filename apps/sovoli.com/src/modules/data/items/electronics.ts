import type { Item } from "~/modules/core/items/types";

export const ELECTRONICS_ITEMS: Item[] = [
  {
    id: "supply-calculator",
    name: "Calculator",
    category: "electronics",
    tags: ["stationery", "calculator", "math"],
    unitLabel: "unit",
  },
  {
    id: "relief-solar-lighting",
    name: "Solar Lighting",
    category: "electronics",
    tags: ["relief", "lighting", "solar"],
  },
  {
    id: "relief-battery-radios",
    name: "Battery Operated Radios",
    category: "electronics",
    unitLabel: "radio",
    tags: ["relief", "communications", "battery"],
    description: "Portable radios with batteries for receiving emergency updates.",
  },
  {
    id: "relief-disposable-batteries",
    name: "Disposable Batteries",
    category: "electronics",
    unitLabel: "pack",
    tags: ["relief", "power", "battery"],
  },
  {
    id: "relief-flashlights",
    name: "Flash Lights",
    category: "electronics",
    unitLabel: "flashlight",
    tags: ["relief", "lighting", "battery"],
  },
  {
    id: "relief-lanterns",
    name: "Lanterns / Lamps",
    category: "electronics",
    unitLabel: "lantern",
    tags: ["relief", "lighting"],
  },
  {
    id: "relief-mobile-battery-packs",
    name: "Mobile Battery Packs",
    category: "electronics",
    unitLabel: "pack",
    tags: ["relief", "power", "mobile"],
  },
  {
    id: "relief-solar-inverter-kit",
    name: "Inverter & Solar Power Kit",
    category: "electronics",
    unitLabel: "kit",
    tags: ["relief", "power", "solar"],
    description:
      "Inverter, panels, and batteries bundled to keep critical devices running.",
  },
  {
    id: "relief-solar-flood-lights",
    name: "Solar Flood Lights",
    category: "electronics",
    unitLabel: "light",
    tags: ["relief", "lighting", "solar"],
  },
  {
    id: "relief-starlink-terminal",
    name: "Starlink Communication Terminal",
    category: "electronics",
    unitLabel: "terminal",
    tags: ["relief", "connectivity", "communications"],
    description: "Satellite-based internet kit for restoring connectivity.",
  },
];
