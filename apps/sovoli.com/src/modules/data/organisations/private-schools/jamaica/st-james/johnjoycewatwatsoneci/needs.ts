import { findItemById } from "~/modules/data/items";
import type { NeedsModule } from "~/modules/needs/types";

const PLYBOARD_SHEET = findItemById("maintenance-plyboard");

if (!PLYBOARD_SHEET) {
  throw new Error("maintenance-plyboard item is missing from core items.");
}

export const JOHN_JOYCE_WATSON_WATSON_ECI_NEEDS: NeedsModule = {
  needs: [
    {
      slug: "johnjoycewatwatsoneci-plyboard-sheet-2025",
      title: "Plyboard Sheet",
      description:
        "Plywood sheets needed for repairing damaged doors, furniture, and structural elements after storm damage.",
      item: PLYBOARD_SHEET,
      quantity: 4,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason:
          "Door, furniture destroyed, fridge, microwave, blender, television, security cameras, teaching aids and children books and toys damaged.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      notes:
        "Required for comprehensive facility restoration including furniture and structural repairs.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
};
