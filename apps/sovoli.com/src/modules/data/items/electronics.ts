import type { Item } from "~/modules/core/items/types";
import { hydrateCategory } from "./categories";

export const ELECTRONICS_ITEMS: Item[] = [
  {
    id: "supply-calculator",
    name: "Calculator",
    category: hydrateCategory("electrical"),
    tags: ["stationery", "calculator", "math"],
    unitLabel: "unit",
  },
  {
    id: "relief-solar-lighting",
    name: "Solar Lighting",
    category: hydrateCategory("electrical"),
    tags: ["relief", "lighting", "solar"],
  },
  {
    id: "relief-battery-radios",
    name: "Battery Operated Radios",
    category: hydrateCategory("electrical"),
    unitLabel: "radio",
    tags: ["relief", "communications", "battery"],
    description:
      "Portable radios with batteries for receiving emergency updates.",
  },
  {
    id: "relief-disposable-batteries",
    name: "Disposable Batteries",
    category: hydrateCategory("electrical"),
    unitLabel: "pack",
    tags: ["relief", "power", "battery"],
  },
  {
    id: "relief-flashlights",
    name: "Flash Lights",
    category: hydrateCategory("electrical"),
    unitLabel: "flashlight",
    tags: ["relief", "lighting", "battery"],
  },
  {
    id: "relief-lanterns",
    name: "Lanterns / Lamps",
    category: hydrateCategory("electrical"),
    unitLabel: "lantern",
    tags: ["relief", "lighting"],
  },
  {
    id: "relief-mobile-battery-packs",
    name: "Mobile Battery Packs",
    category: hydrateCategory("electrical"),
    unitLabel: "pack",
    tags: ["relief", "power", "mobile"],
  },
  {
    id: "relief-solar-inverter-kit",
    name: "Inverter & Solar Power Kit",
    category: hydrateCategory("electrical"),
    unitLabel: "kit",
    tags: ["relief", "power", "solar"],
    description:
      "Inverter, panels, and batteries bundled to keep critical devices running.",
  },
  {
    id: "relief-solar-flood-lights",
    name: "Solar Flood Lights",
    category: hydrateCategory("electrical"),
    unitLabel: "light",
    tags: ["relief", "lighting", "solar"],
  },
  {
    id: "relief-starlink-terminal",
    name: "Starlink Communication Terminal",
    category: hydrateCategory("electrical"),
    unitLabel: "terminal",
    tags: ["relief", "connectivity", "communications"],
    description: "Satellite-based internet kit for restoring connectivity.",
  },
];
