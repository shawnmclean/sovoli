import type { Item } from "~/modules/core/items/types";
import { hydrateCategory } from "./categories";

export const PLUMBING_HEATING_VENTILATION_AIR_CONDITIONING_ITEMS: Item[] = [
  {
    id: "equipment-ac-unit",
    name: "Air Conditioning Unit",
    category: hydrateCategory("air-conditioners-coolers-fixed"),
    tags: ["facilities", "classroom", "cooling"],
    unitLabel: "unit",
    description:
      "Standard split-system AC unit suitable for classroom environments.",
  },
];
