import { findItemById } from "~/modules/data/items";
import type { NeedsModule } from "~/modules/needs/types";

const INDUSTRIAL_SHEET = findItemById("industrial-roof-sheeting");
const EXTERIOR_DOOR = findItemById("exterior-door-36x80");

if (!INDUSTRIAL_SHEET) {
  throw new Error("industrial-roof-sheeting item is missing from core items.");
}

if (!EXTERIOR_DOOR) {
  throw new Error("exterior-door-36x80 item is missing from core items.");
}

export const SANDY_BANK_INFANT_SCHOOL_NEEDS: NeedsModule = {
  needs: [
    {
      slug: "sandybankinfant-industrial-sheeting-2025",
      title: "Industrial Roof Sheeting",
      description:
        "Provide industrial roof sheeting measured in squares to replace the entire roof damaged during the hurricane.",
      item: INDUSTRIAL_SHEET,
      quantity: 16,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason: "Entire roof damaged; classrooms exposed to weather.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      notes: "Quantity requested as 16 squares to cover full roof span.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "sandybankinfant-exterior-door-2025",
      title: "36x80 Exterior Door",
      description:
        "Install a replacement exterior door to secure the main classroom block after roof repairs.",
      item: EXTERIOR_DOOR,
      quantity: 1,
      type: "material",
      source: "external",
      priority: "medium",
      neededBy: {
        type: "asap",
        reason: "Existing door damaged alongside roof and needs replacement for security.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
};
