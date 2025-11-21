import { findItemById } from "~/modules/data/items";
import type { NeedsModule } from "~/modules/needs/types";

// Educational supplies
const CRAYOLA_CRAYONS = findItemById("supply-crayola-crayons-fat");
const PENCILS_PACK = findItemById("supply-pencils-pack-12");
const CRAYOLA_PLAY_DOUGH = findItemById("supply-crayola-play-dough");
const BUILDING_BLOCKS = findItemById("supply-building-blocks");
const EXERCISE_BOOK_BIG = findItemById("supply-exercise-book-big");
const DOUBLE_LINE_BOOK = findItemById("supply-double-line-book");

// Construction tools and materials
const IMPACT_DRIVER = findItemById("impact-driver");
const TIN_SNIPS = findItemById("tin-snips");
const MEASURING_TAPE = findItemById("measuring-tape-25ft");
const ROOFING_HAMMER = findItemById("roofing-hammer");
const ROOF_SEALANT = findItemById("roof-sealant");
const PLYBOARD_SHEET = findItemById("maintenance-plyboard");
const ROOF_FLASHING = findItemById("roof-flashing-12ft");

if (!CRAYOLA_CRAYONS) {
  throw new Error(
    "supply-crayola-crayons-fat item is missing from core items.",
  );
}

if (!PENCILS_PACK) {
  throw new Error("supply-pencils-pack-12 item is missing from core items.");
}

if (!CRAYOLA_PLAY_DOUGH) {
  throw new Error("supply-crayola-play-dough item is missing from core items.");
}

if (!BUILDING_BLOCKS) {
  throw new Error("supply-building-blocks item is missing from core items.");
}

if (!EXERCISE_BOOK_BIG) {
  throw new Error("supply-exercise-book-big item is missing from core items.");
}

if (!DOUBLE_LINE_BOOK) {
  throw new Error("supply-double-line-book item is missing from core items.");
}

if (!IMPACT_DRIVER) {
  throw new Error("impact-driver item is missing from core items.");
}

if (!TIN_SNIPS) {
  throw new Error("tin-snips item is missing from core items.");
}

if (!MEASURING_TAPE) {
  throw new Error("measuring-tape-25ft item is missing from core items.");
}

if (!ROOFING_HAMMER) {
  throw new Error("roofing-hammer item is missing from core items.");
}

if (!ROOF_SEALANT) {
  throw new Error("roof-sealant item is missing from core items.");
}

if (!PLYBOARD_SHEET) {
  throw new Error("maintenance-plyboard item is missing from core items.");
}

if (!ROOF_FLASHING) {
  throw new Error("roof-flashing-12ft item is missing from core items.");
}

export const EMMANUEL_KINDER_PREP_NEEDS: NeedsModule = {
  needs: [
    // Educational supplies
    {
      slug: "emmanuelkinderprep-crayola-crayons-2025",
      title: "Crayola Crayons (Fat)",
      description:
        "Replace damaged art supplies for early childhood education activities.",
      item: CRAYOLA_CRAYONS,
      quantity: 12,
      type: "material",
      source: "external",
      priority: "medium",
      neededBy: {
        type: "asap",
        reason:
          "Charts and teaching materials destroyed, need to restore learning activities.",
      },
      requestingUnit: {
        locationKey: "main",
      },
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "emmanuelkinderprep-pencils-pack-2025",
      title: "Pencils pack of 12",
      description:
        "Basic writing supplies for students to continue educational activities.",
      item: PENCILS_PACK,
      quantity: 12,
      type: "material",
      source: "external",
      priority: "medium",
      neededBy: {
        type: "asap",
        reason: "Essential supplies for daily learning activities.",
      },
      requestingUnit: {
        locationKey: "main",
      },
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "emmanuelkinderprep-play-dough-2025",
      title: "Crayola Play Dough",
      description:
        "Sensory learning materials for early childhood development activities.",
      item: CRAYOLA_PLAY_DOUGH,
      quantity: 5,
      type: "material",
      source: "external",
      priority: "medium",
      neededBy: {
        type: "asap",
        reason: "Important for motor skills development in young children.",
      },
      requestingUnit: {
        locationKey: "main",
      },
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "emmanuelkinderprep-building-blocks-2025",
      title: "Building Blocks",
      description:
        "Educational toys for cognitive development and creative play.",
      item: BUILDING_BLOCKS,
      quantity: 12,
      type: "material",
      source: "external",
      priority: "medium",
      neededBy: {
        type: "asap",
        reason: "Essential for hands-on learning and development activities.",
      },
      requestingUnit: {
        locationKey: "main",
      },
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "emmanuelkinderprep-exercise-book-big-2025",
      title: "Exercise Book Big",
      description:
        "Large exercise books for student writing and homework activities.",
      item: EXERCISE_BOOK_BIG,
      quantity: 24,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason: "Essential for daily classroom activities and student work.",
      },
      requestingUnit: {
        locationKey: "main",
      },
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "emmanuelkinderprep-double-line-book-2025",
      title: "Double Line Book",
      description:
        "Specialized writing books for handwriting practice and development.",
      item: DOUBLE_LINE_BOOK,
      quantity: 15,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason:
          "Critical for proper handwriting development in young students.",
      },
      requestingUnit: {
        locationKey: "main",
      },
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // Construction tools and materials
    {
      slug: "emmanuelkinderprep-impact-driver-2025",
      title: "18V Cordless Impact Driver",
      description:
        "Power tools needed for roof repair and facility restoration work.",
      item: IMPACT_DRIVER,
      quantity: 4,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason: "Essential for roof repairs and structural restoration.",
      },
      requestingUnit: {
        locationKey: "main",
      },
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "emmanuelkinderprep-tin-snips-2025",
      title: "Tin Snips",
      description: "Cutting tools for metal roofing work and facility repairs.",
      item: TIN_SNIPS,
      quantity: 3,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason: "Required for cutting and fitting roofing materials.",
      },
      requestingUnit: {
        locationKey: "main",
      },
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "emmanuelkinderprep-measuring-tape-2025",
      title: "25 ft Measuring Tape",
      description: "Measuring tools for accurate construction and repair work.",
      item: MEASURING_TAPE,
      quantity: 3,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason: "Essential for precise measurements during repairs.",
      },
      requestingUnit: {
        locationKey: "main",
      },
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "emmanuelkinderprep-roofing-hammer-2025",
      title: "Roofing Claw Hammer",
      description:
        "Specialized hammers for roofing work and general construction.",
      item: ROOFING_HAMMER,
      quantity: 3,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason: "Required for roofing installation and repair work.",
      },
      requestingUnit: {
        locationKey: "main",
      },
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "emmanuelkinderprep-roof-sealant-2025",
      title: "Roof Sealant",
      description:
        "Waterproofing materials to seal roof joints and prevent leaks.",
      item: ROOF_SEALANT,
      quantity: 4,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason: "Critical for waterproofing and preventing further damage.",
      },
      requestingUnit: {
        locationKey: "main",
      },
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "emmanuelkinderprep-plyboard-sheet-2025",
      title: "Plyboard Sheet",
      description:
        "Plywood sheets for structural repairs and furniture restoration.",
      item: PLYBOARD_SHEET,
      quantity: 6,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason:
          "Needed for repairing damaged furniture and structural elements.",
      },
      requestingUnit: {
        locationKey: "main",
      },
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "emmanuelkinderprep-roof-flashing-2025",
      title: "Galvanized Roof Flashing - 12 ft",
      description:
        "Metal flashing for proper roof sealing and water management.",
      item: ROOF_FLASHING,
      quantity: 4,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason: "Essential for proper roof installation and leak prevention.",
      },
      requestingUnit: {
        locationKey: "main",
      },
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
};
