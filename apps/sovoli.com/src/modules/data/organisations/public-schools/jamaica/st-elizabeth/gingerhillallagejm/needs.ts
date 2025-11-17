import type { NeedsModule } from "~/modules/needs/types";
import { findItemById } from "~/modules/data/items";

const ZINC_ROOF_SHEET_ITEM = findItemById("zinc-roof-sheet");
const TARPAULIN_ITEM = findItemById("tarpaulin-heavy-duty");
const ROOF_SEALANT_ITEM = findItemById("roof-sealant");
const FASTENER_ITEM = findItemById("relief-screws");
const TOOL_KIT_ITEM = findItemById("relief-basic-hand-tools");

if (!ZINC_ROOF_SHEET_ITEM) {
  throw new Error(
    "maintenance-zinc-roof-sheet item is missing from core items.",
  );
}

if (!TARPAULIN_ITEM) {
  throw new Error("tarpaulin-heavy-duty item is missing from core items.");
}

if (!ROOF_SEALANT_ITEM) {
  throw new Error("roof-sealant item is missing from core items.");
}

if (!FASTENER_ITEM) {
  throw new Error("relief-screws item is missing from core items.");
}

if (!TOOL_KIT_ITEM) {
  throw new Error("relief-basic-hand-tools item is missing from core items.");
}

const PROJECT_ID = "ghaa-hurricane-melissa-stabilization-2025";
const LOCATION_KEY = "main-campus";
const CREATED_AT = "2025-11-14";

export const GINGER_HILL_ALL_AGE_NEEDS: NeedsModule = {
  needs: [
    {
      slug: "ghaa-zinc-roof-sheet-2025",
      projectId: PROJECT_ID,
      title: "Replacement Zinc Roof Panels",
      description:
        "Source corrugated zinc panels to rebuild the infant block roof that was torn away during Hurricane Melissa.",
      item: ZINC_ROOF_SHEET_ITEM,
      quantity: 90,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "deadline",
        date: "2025-11-25",
      },
      requestingUnit: {
        locationKey: LOCATION_KEY,
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
      createdAt: CREATED_AT,
      updatedAt: CREATED_AT,
    },
    {
      slug: "ghaa-heavy-duty-tarps-2025",
      projectId: PROJECT_ID,
      title: "Temporary Classroom Tarpaulins",
      description:
        "Install heavy-duty tarps to keep classrooms dry while roof trusses are reinforced.",
      item: TARPAULIN_ITEM,
      quantity: 12,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        requestedAt: "2025-11-14",
        reason: "Prevent further water damage to books and furniture.",
      },
      requestingUnit: {
        locationKey: LOCATION_KEY,
      },
      status: "planned",
      procurement: {
        estimatedCost: 210000,
        currency: "JMD",
        status: "quoted",
        notes: "Tarps will be reused later for storm shelter kits.",
      },
      notes: "Requires volunteer crew to install and monitor after heavy rain.",
      createdAt: CREATED_AT,
      updatedAt: CREATED_AT,
    },
    {
      slug: "ghaa-roof-sealant-2025",
      projectId: PROJECT_ID,
      title: "Weatherproof Roof Sealant",
      description:
        "Apply sealant along seams and flashing to stop leaks once new sheets are installed.",
      item: ROOF_SEALANT_ITEM,
      quantity: 24,
      type: "material",
      source: "external",
      priority: "medium",
      neededBy: {
        type: "deadline",
        date: "2025-11-28",
      },
      requestingUnit: {
        locationKey: LOCATION_KEY,
      },
      status: "planned",
      procurement: {
        estimatedCost: 300000,
        currency: "JMD",
        status: "quoted",
        notes: "Includes applicator kits provided by roofing contractor.",
      },
      notes: "Store indoors to avoid hardening before installation.",
      createdAt: CREATED_AT,
      updatedAt: CREATED_AT,
    },
    {
      slug: "ghaa-roof-fastener-kits-2025",
      projectId: PROJECT_ID,
      title: "Roof Fastener Kits",
      description:
        "Secure screws with washers rated for hurricane-force winds to anchor the replacement roofing sheets.",
      item: FASTENER_ITEM,
      quantity: 18,
      type: "material",
      source: "external",
      priority: "medium",
      neededBy: {
        type: "deadline",
        date: "2025-11-23",
      },
      requestingUnit: {
        locationKey: LOCATION_KEY,
      },
      status: "planned",
      procurement: {
        estimatedCost: 72000,
        currency: "JMD",
        status: "quoted",
        notes: "Includes corrosion-resistant washers and driver bits.",
      },
      notes: "Pairs with roofing panels delivery to avoid installation delays.",
      createdAt: CREATED_AT,
      updatedAt: CREATED_AT,
    },
    {
      slug: "ghaa-roofing-tool-kits-2025",
      projectId: PROJECT_ID,
      title: "Roofing Tool Kits for Volunteers",
      description:
        "Equip volunteer crews with shared tool kits (hammers, cutters, safety gear) for safe roof repairs.",
      item: TOOL_KIT_ITEM,
      quantity: 6,
      type: "material",
      source: "external",
      priority: "medium",
      neededBy: {
        type: "asap",
        requestedAt: "2025-11-14",
        reason: "Crews mobilizing this weekend need complete kits.",
      },
      requestingUnit: {
        locationKey: LOCATION_KEY,
      },
      status: "planned",
      procurement: {
        estimatedCost: 180000,
        currency: "JMD",
        status: "quoted",
        notes: "Local hardware store will assemble the kits on short notice.",
      },
      notes: "Include safety gloves and harness attachments in each kit.",
      createdAt: CREATED_AT,
      updatedAt: CREATED_AT,
    },
  ],
};
