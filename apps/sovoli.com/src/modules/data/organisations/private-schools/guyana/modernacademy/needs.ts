import type { NeedsModule } from "~/modules/needs/types";
import { findItemById } from "~/modules/data/items";

const AC_UNIT_ITEM = findItemById("equipment-ac-unit");
const PLYBOARD_ITEM = findItemById("maintenance-plyboard");

if (!AC_UNIT_ITEM) {
  throw new Error("equipment-ac-unit item is missing from core items.");
}

if (!PLYBOARD_ITEM) {
  throw new Error("maintenance-plyboard item is missing from core items.");
}

export const MODERN_ACADEMY_NEEDS: NeedsModule = {
  needs: [
    {
      id: "magy-classroom-ac-2025",
      title: "Classroom Air Conditioning Units",
      description:
        "Install new air conditioning units to keep the main campus classrooms cool before the new school year.",
      item: AC_UNIT_ITEM,
      quantity: 3,
      unit: "unit",
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "deadline",
        date: "2025-08-15",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      notes: "Coordinate installation with Joel and facilities contractor.",
      createdAt: "2025-06-01",
      updatedAt: "2025-06-01",
      procurement: {
        estimatedCost: 450000, // example cost (GYD)
        currency: "GYD",
        status: "quoted",
        notes: "Awaiting supplier confirmation for installation package.",
      },
    },
    {
      id: "magy-building-plyboards-2025",
      title: "Plyboards for Building Repairs",
      description:
        "Purchase plyboards to repair classroom walls and prevent further weather damage.",
      item: PLYBOARD_ITEM,
      quantity: 10,
      unit: "boards",
      type: "material",
      source: "external",
      priority: "medium",
      neededBy: {
        type: "asap",
        requestedAt: "2025-06-10",
        reason: "Urgent building maintenance",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      notes:
        "Coordinate with maintenance team to schedule repairs once delivered.",
      createdAt: "2025-06-07",
      updatedAt: "2025-06-07",
      procurement: {
        estimatedCost: 24000,
        currency: "GYD",
        status: "quoted",
        notes: "Pending approval before ordering.",
      },
    },
  ],
};
