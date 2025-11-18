import { findItemById } from "~/modules/data/items";
import type { NeedsModule } from "~/modules/needs/types";

export const GINGER_HILL_ALL_AGE_NEEDS: NeedsModule = {
  needs: [
    {
      slug: "ghaa-zinc-roof-sheet-2025",
      title: "Replacement Zinc Roof Panels",
      description:
        "Source corrugated zinc panels to rebuild the infant block roof that was torn away during Hurricane Melissa.",
      item: (() => {
        const item = findItemById("zinc-roof-sheet");
        if (!item) {
          throw new Error(`Item with id "zinc-roof-sheet" not found`);
        }
        return item;
      })(),
      quantity: 90,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "deadline",
        date: "2025-11-25",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      procurement: {
        estimatedCost: 945000,
        currency: "JMD",
        status: "quoted",
        notes:
          "Supplier in Santa Cruz can deliver within four days of deposit.",
      },
      notes: "Panels must be pre-cut to match existing classroom spans.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
};
