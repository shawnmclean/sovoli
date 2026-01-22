import { findItemById } from "~/modules/data/items";
import type { Need, NeedsModule } from "~/modules/needs/types";
import { PRIMARY_TEACHER } from "./workforceMeta";

const AC_UNIT_ITEM = findItemById("equipment-ac-unit");

if (!AC_UNIT_ITEM) {
  throw new Error("equipment-ac-unit item is missing from core items.");
}

const PRIMARY_TEACHER_NEED: Need = {
  slug: "magy-primary-teacher-2025",
  title: "Primary School Teacher",
  description:
    "Hire a primary school teacher to teach literacy, numeracy, and social skills at the primary education level.",
  position: PRIMARY_TEACHER,
  quantity: 1,
  type: "job",
  neededBy: { type: "deadline", date: "2025-12-05" },
};

export const MODERN_ACADEMY_NEEDS: NeedsModule = {
  needs: [
    PRIMARY_TEACHER_NEED,
    {
      slug: "magy-classroom-ac-2025",
      title: "Classroom Air Conditioning Units",
      description:
        "Install new air conditioning units to keep the main campus classrooms cool before the new school year.",
      item: AC_UNIT_ITEM,
      quantity: 3,
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
  ],
};
