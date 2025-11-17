import type { NeedsModule } from "~/modules/needs/types";
import { findItemById } from "~/modules/data/items";

const ROOF_SHEET_ITEM = findItemById("maintenance-zinc-roof-sheet");
const TARPAULIN_ITEM = findItemById("tarpaulin-heavy-duty");
const CLEANUP_KIT_ITEM = findItemById("supply-cleanup-kit");
const PORTABLE_GENERATOR_ITEM = findItemById("equipment-portable-generator");

if (!ROOF_SHEET_ITEM) {
  throw new Error(
    "maintenance-zinc-roof-sheet item is missing from core items.",
  );
}

if (!TARPAULIN_ITEM) {
  throw new Error("tarpaulin-heavy-duty item is missing from core items.");
}

if (!CLEANUP_KIT_ITEM) {
  throw new Error("supply-cleanup-kit item is missing from core items.");
}

if (!PORTABLE_GENERATOR_ITEM) {
  throw new Error(
    "equipment-portable-generator item is missing from core items.",
  );
}

export const APPLETON_BASIC_SCHOOL_NEEDS: NeedsModule = {
  needs: [
    {
      slug: "absjm-roof-repairs-2025",
      projectId: "absjm-hurricane-recovery-2025",
      title: "Replace Damaged Roofing Sheets",
      description:
        "Source zinc roofing sheets to rebuild the infant block roof that was torn off during the hurricane.",
      item: ROOF_SHEET_ITEM,
      quantity: 45,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "deadline",
        date: "2025-11-15",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      procurement: {
        estimatedCost: 675000,
        currency: "JMD",
        status: "quoted",
        notes:
          "Awaiting final quote from local hardware supplier in Santa Cruz.",
      },
      notes:
        "Coordinate installation with certified roofing contractor once materials arrive.",
      createdAt: "2025-09-20",
      updatedAt: "2025-09-20",
    },
    {
      slug: "absjm-tarpaulin-cover-2025",
      projectId: "absjm-hurricane-recovery-2025",
      title: "Temporary Classroom Tarpaulins",
      description:
        "Procure heavy-duty tarpaulins to keep classrooms dry until permanent roof repairs are completed.",
      item: TARPAULIN_ITEM,
      quantity: 10,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        requestedAt: "2025-09-18",
        reason: "Prevent water damage to learning materials",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      procurement: {
        estimatedCost: 150000,
        currency: "JMD",
        status: "quoted",
        notes: "Supplier can deliver within five days once deposit is made.",
      },
      notes:
        "Ensure tarpaulins are installed securely to withstand additional rainfall.",
      createdAt: "2025-09-19",
      updatedAt: "2025-09-19",
    },
    {
      slug: "absjm-cleanup-kits-2025",
      projectId: "absjm-hurricane-recovery-2025",
      title: "Disaster Cleanup Kits",
      description:
        "Acquire sanitation and safety kits for staff and volunteers clearing flooded classrooms and storerooms.",
      item: CLEANUP_KIT_ITEM,
      quantity: 12,
      type: "material",
      source: "external",
      priority: "medium",
      neededBy: {
        type: "asap",
        requestedAt: "2025-09-17",
        reason: "Allow safe removal of debris and standing water",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      procurement: {
        estimatedCost: 84000,
        currency: "JMD",
        status: "quoted",
        notes:
          "Community partner in Black River has offered discounted pricing.",
      },
      notes: "Distribute kits to volunteer teams before each cleanup shift.",
      createdAt: "2025-09-18",
      updatedAt: "2025-09-18",
    },
    {
      slug: "absjm-portable-generator-2025",
      projectId: "absjm-hurricane-recovery-2025",
      title: "Portable Backup Generators",
      description:
        "Secure portable generators to power lighting and pumps while the utility supply remains unstable.",
      item: PORTABLE_GENERATOR_ITEM,
      quantity: 2,
      type: "material",
      source: "external",
      priority: "medium",
      neededBy: {
        type: "deadline",
        date: "2025-10-05",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      procurement: {
        estimatedCost: 520000,
        currency: "JMD",
        status: "quoted",
        notes: "Seeking sponsorship to offset upfront cost of generators.",
      },
      notes: "Coordinate storage and refuelling schedule with caretaker team.",
      createdAt: "2025-09-21",
      updatedAt: "2025-09-21",
    },
    {
      slug: "absjm-skilled-volunteers-2025",
      projectId: "absjm-hurricane-recovery-2025",
      title: "Volunteer Carpenters",
      description:
        "Recruit skilled volunteer carpenters to assist with roof framing repairs and door replacements.",
      quantity: 4,
      type: "human",
      source: "external",
      priority: "high",
      neededBy: {
        type: "deadline",
        date: "2025-10-01",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      procurement: {
        notes:
          "Coordinate with parish disaster committee to schedule volunteer teams.",
      },
      notes:
        "Volunteers should have experience with small-scale roof construction.",
      createdAt: "2025-09-16",
      updatedAt: "2025-09-16",
    },
    {
      slug: "absjm-debris-removal-crew-2025",
      projectId: "absjm-hurricane-recovery-2025",
      title: "Debris Removal Crew",
      description:
        "Contract a local waste management crew to clear fallen trees, broken fencing, and water-damaged furniture.",
      quantity: 1,
      type: "service",
      source: "external",
      priority: "high",
      neededBy: {
        type: "deadline",
        date: "2025-09-28",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      procurement: {
        estimatedCost: 185000,
        currency: "JMD",
        status: "quoted",
        notes:
          "Awaiting approval from school board to engage preferred contractor.",
      },
      notes:
        "Ensure debris is removed before structural repair crews mobilize on site.",
      createdAt: "2025-09-17",
      updatedAt: "2025-09-17",
    },
  ],
};
