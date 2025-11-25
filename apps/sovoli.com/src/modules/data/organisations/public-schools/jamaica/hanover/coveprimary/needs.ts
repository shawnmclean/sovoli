import { findItemById } from "~/modules/data/items";
import type { NeedsModule } from "~/modules/needs/types";

// Roofing materials
const CORRUGATED_ZINC_12FT = findItemById("corrugated-zinc-12ft");
const ZINC_ROOF_SHEET = findItemById("zinc-roof-sheet");
const MAINTENANCE_ZINC_ROOF_SHEET = findItemById("maintenance-zinc-roof-sheet");
const INDUSTRIAL_ROOF_SHEETING = findItemById("industrial-roof-sheeting");
const RIDGE_CAP_12FT = findItemById("ridge-cap-12ft");
const ROOF_SEALANT = findItemById("roof-sealant");

// Fasteners
const ROOFING_SCREWS_WASHERS = findItemById(
  "maintenance-zinc-roof-screws-2-5in",
);
const ROOFING_SCREWS = findItemById("relief-screws");
const ROOFING_NAILS = findItemById("roofing-nails-2-5in");
const HURRICANE_STRAP_NAILS = findItemById("strap-nails-3in");

// Lumber and plywood
const PLYBOARD_SHEET = findItemById("maintenance-plyboard");
const PLYWOOD_3_4_4X8 = findItemById("plywood-3-4-4x8");
const LUMBER_2X2X12 = findItemById("lumber-2x2x12");
const PURLIN_1X4X12 = findItemById("purlin-1x4x12");
const LUMBER_2X4X12 = findItemById("lumber-2x4x12");
const LUMBER_2X6X12 = findItemById("lumber-2x6x12");

// Hardware
const DOOR_TRIM_ADHESIVE = findItemById("door-trim-adhesive");
const EXTERIOR_DOOR = findItemById("exterior-door-36x80");

// Educational supplies
const BUILDING_BLOCKS = findItemById("supply-building-blocks");
const CRAYOLA_PLAY_DOUGH = findItemById("supply-crayola-play-dough");
const FAT_PENCIL = findItemById("supply-fat-pencil");
const PENCILS_PACK = findItemById("supply-pencils-pack-12");
const EXERCISE_BOOK_SMALL = findItemById(
  "supply-exercise-book-small-fine-line",
);
const EXERCISE_BOOK_BIG = findItemById("supply-exercise-book-big");
const DOUBLE_LINE_BOOK = findItemById("supply-double-line-book");

// Tools
const MEASURING_TAPE = findItemById("measuring-tape-25ft");

// Equipment
const AC_UNIT = findItemById("equipment-ac-unit");

// Validation
const requiredItems = [
  { item: CORRUGATED_ZINC_12FT, id: "corrugated-zinc-12ft" },
  { item: ZINC_ROOF_SHEET, id: "zinc-roof-sheet" },
  { item: MAINTENANCE_ZINC_ROOF_SHEET, id: "maintenance-zinc-roof-sheet" },
  { item: INDUSTRIAL_ROOF_SHEETING, id: "industrial-roof-sheeting" },
  { item: RIDGE_CAP_12FT, id: "ridge-cap-12ft" },
  { item: ROOF_SEALANT, id: "roof-sealant" },
  { item: ROOFING_SCREWS_WASHERS, id: "maintenance-zinc-roof-screws-2-5in" },
  { item: ROOFING_SCREWS, id: "relief-screws" },
  { item: ROOFING_NAILS, id: "roofing-nails-2-5in" },
  { item: HURRICANE_STRAP_NAILS, id: "strap-nails-3in" },
  { item: PLYBOARD_SHEET, id: "maintenance-plyboard" },
  { item: PLYWOOD_3_4_4X8, id: "plywood-3-4-4x8" },
  { item: LUMBER_2X2X12, id: "lumber-2x2x12" },
  { item: PURLIN_1X4X12, id: "purlin-1x4x12" },
  { item: LUMBER_2X4X12, id: "lumber-2x4x12" },
  { item: LUMBER_2X6X12, id: "lumber-2x6x12" },
  { item: DOOR_TRIM_ADHESIVE, id: "door-trim-adhesive" },
  { item: EXTERIOR_DOOR, id: "exterior-door-36x80" },
  { item: BUILDING_BLOCKS, id: "supply-building-blocks" },
  { item: CRAYOLA_PLAY_DOUGH, id: "supply-crayola-play-dough" },
  { item: FAT_PENCIL, id: "supply-fat-pencil" },
  { item: PENCILS_PACK, id: "supply-pencils-pack-12" },
  { item: EXERCISE_BOOK_SMALL, id: "supply-exercise-book-small-fine-line" },
  { item: EXERCISE_BOOK_BIG, id: "supply-exercise-book-big" },
  { item: DOUBLE_LINE_BOOK, id: "supply-double-line-book" },
  { item: MEASURING_TAPE, id: "measuring-tape-25ft" },
  { item: AC_UNIT, id: "equipment-ac-unit" },
];

for (const { item, id } of requiredItems) {
  if (!item) {
    throw new Error(`${id} item is missing from core items.`);
  }
}

// Type assertions after validation
const validatedItems = {
  CORRUGATED_ZINC_12FT: CORRUGATED_ZINC_12FT!,
  ZINC_ROOF_SHEET: ZINC_ROOF_SHEET!,
  MAINTENANCE_ZINC_ROOF_SHEET: MAINTENANCE_ZINC_ROOF_SHEET!,
  INDUSTRIAL_ROOF_SHEETING: INDUSTRIAL_ROOF_SHEETING!,
  RIDGE_CAP_12FT: RIDGE_CAP_12FT!,
  ROOF_SEALANT: ROOF_SEALANT!,
  ROOFING_SCREWS_WASHERS: ROOFING_SCREWS_WASHERS!,
  ROOFING_SCREWS: ROOFING_SCREWS!,
  ROOFING_NAILS: ROOFING_NAILS!,
  HURRICANE_STRAP_NAILS: HURRICANE_STRAP_NAILS!,
  PLYBOARD_SHEET: PLYBOARD_SHEET!,
  PLYWOOD_3_4_4X8: PLYWOOD_3_4_4X8!,
  LUMBER_2X2X12: LUMBER_2X2X12!,
  PURLIN_1X4X12: PURLIN_1X4X12!,
  LUMBER_2X4X12: LUMBER_2X4X12!,
  LUMBER_2X6X12: LUMBER_2X6X12!,
  DOOR_TRIM_ADHESIVE: DOOR_TRIM_ADHESIVE!,
  EXTERIOR_DOOR: EXTERIOR_DOOR!,
  BUILDING_BLOCKS: BUILDING_BLOCKS!,
  CRAYOLA_PLAY_DOUGH: CRAYOLA_PLAY_DOUGH!,
  FAT_PENCIL: FAT_PENCIL!,
  PENCILS_PACK: PENCILS_PACK!,
  EXERCISE_BOOK_SMALL: EXERCISE_BOOK_SMALL!,
  EXERCISE_BOOK_BIG: EXERCISE_BOOK_BIG!,
  DOUBLE_LINE_BOOK: DOUBLE_LINE_BOOK!,
  MEASURING_TAPE: MEASURING_TAPE!,
  AC_UNIT: AC_UNIT!,
};

// Aggregated quantities from all Airtable submissions
// cove-primary records: 30 AC units, 100 corrugated zinc, 150 zinc roof, etc.
// cove-primary-school records: 30 corrugated zinc, 40 zinc roof, etc.
// Taking maximum quantities where there are discrepancies
const now = new Date().toISOString();

export const COVE_PRIMARY_NEEDS: NeedsModule = {
  needs: [
    {
      slug: "cove-primary-ac-unit-2025",
      title: "Air Conditioning Unit",
      description:
        "Replace damaged air conditioning units after hurricane damage.",
      item: validatedItems.AC_UNIT,
      quantity: 30,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason: "Essential for comfortable learning environment.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "cove-primary-corrugated-zinc-2025",
      title: "Corrugated Zinc Sheet - 12 ft (28 gauge)",
      description: "Roofing materials for replacing damaged classroom roofs.",
      item: validatedItems.CORRUGATED_ZINC_12FT,
      quantity: 100,
      type: "material",
      source: "external",
      priority: "critical",
      neededBy: {
        type: "asap",
        reason: "Roof completely caved in, urgent replacement needed.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "cove-primary-zinc-roof-sheet-2025",
      title: "Zinc Roof Sheet",
      description: "Additional roofing sheets for roof repairs.",
      item: validatedItems.ZINC_ROOF_SHEET,
      quantity: 150,
      type: "material",
      source: "external",
      priority: "critical",
      neededBy: {
        type: "asap",
        reason: "Complete roof replacement required after hurricane damage.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "cove-primary-maintenance-zinc-2025",
      title: "Zinc Roof Sheet - Maintenance",
      description: "Maintenance-grade zinc sheets for ongoing repairs.",
      item: validatedItems.MAINTENANCE_ZINC_ROOF_SHEET,
      quantity: 100,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason: "Ongoing maintenance and repair work needed.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "cove-primary-industrial-roof-sheeting-2025",
      title: "Industrial Roof Sheeting (Square)",
      description: "Industrial-grade roof sheeting for full building coverage.",
      item: validatedItems.INDUSTRIAL_ROOF_SHEETING,
      quantity: 150,
      type: "material",
      source: "external",
      priority: "critical",
      neededBy: {
        type: "asap",
        reason: "Large-scale roof replacement required.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "cove-primary-ridge-cap-2025",
      title: "Zinc Ridge Cap - 12 ft",
      description: "Ridge caps for sealing roof peaks.",
      item: validatedItems.RIDGE_CAP_12FT,
      quantity: 100,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason: "Required for proper roof installation and sealing.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "cove-primary-roof-sealant-2025",
      title: "Roof Sealant",
      description: "Waterproofing sealant for roof joints and repairs.",
      item: validatedItems.ROOF_SEALANT,
      quantity: 40,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason: "Critical for waterproofing and preventing further damage.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "cove-primary-roofing-screws-washers-2025",
      title: "Roofing Screws w/ Washers - 2.5 in",
      description:
        "Self-drilling screws with neoprene washers for fastening zinc sheets.",
      item: validatedItems.ROOFING_SCREWS_WASHERS,
      quantity: 200,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason: "Essential for secure roof installation.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "cove-primary-roofing-screws-2025",
      title: "Roofing Screws",
      description: "General purpose roofing screws for repair work.",
      item: validatedItems.ROOFING_SCREWS,
      quantity: 200,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason: "Required for fastening roofing materials.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "cove-primary-roofing-nails-2025",
      title: "Galvanized Roofing Nails - 2.5 in",
      description:
        "Ring-shank nails for batten strips and hurricane strapping.",
      item: validatedItems.ROOFING_NAILS,
      quantity: 150,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason: "Essential for secure roof attachment.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "cove-primary-hurricane-strap-nails-2025",
      title: "Hurricane Strap Nails - 3 in",
      description: "Hot-dip galvanized nails for metal straps and connectors.",
      item: validatedItems.HURRICANE_STRAP_NAILS,
      quantity: 150,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason: "Critical for hurricane-resistant roof installation.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "cove-primary-plyboard-sheet-2025",
      title: "Plyboard Sheet",
      description:
        "Plywood sheets for structural repairs and furniture restoration.",
      item: validatedItems.PLYBOARD_SHEET,
      quantity: 250,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason:
          "Needed for repairing damaged furniture and structural elements.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "cove-primary-plywood-2025",
      title: "3/4 in Plywood - 4x8 ft",
      description:
        "Thick sheet stock for decking repairs and roof sheathing replacement.",
      item: validatedItems.PLYWOOD_3_4_4X8,
      quantity: 260,
      type: "material",
      source: "external",
      priority: "critical",
      neededBy: {
        type: "asap",
        reason: "Essential for structural roof decking.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "cove-primary-lumber-2x2x12-2025",
      title: "2x2x12 ft Treated Lumber",
      description: "Lumber for batten strips and roof bracing.",
      item: validatedItems.LUMBER_2X2X12,
      quantity: 200,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason: "Required for roof structure support.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "cove-primary-purlin-2025",
      title: "1x4x12 ft Purlin Board",
      description:
        "Treated purlin used under zinc sheets for fastening and ventilation.",
      item: validatedItems.PURLIN_1X4X12,
      quantity: 150,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason: "Essential for proper roof structure.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "cove-primary-lumber-2x4x12-2025",
      title: "2x4x12 ft Framing Lumber",
      description: "Common stud length for framing repairs.",
      item: validatedItems.LUMBER_2X4X12,
      quantity: 251,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason: "Required for structural framing repairs.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "cove-primary-lumber-2x6x12-2025",
      title: "2x6x12 ft Framing Lumber",
      description: "Lumber for rafters and ridge boards in roof structures.",
      item: validatedItems.LUMBER_2X6X12,
      quantity: 251,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason: "Essential for roof structure support.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "cove-primary-door-trim-adhesive-2025",
      title: "Door Trim Adhesive Protection",
      description: "Adhesive for door trim installation and protection.",
      item: validatedItems.DOOR_TRIM_ADHESIVE,
      quantity: 251,
      type: "material",
      source: "external",
      priority: "medium",
      neededBy: {
        type: "asap",
        reason: "Needed for door installation and repairs.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "cove-primary-exterior-door-2025",
      title: "Exterior Door - 36x80",
      description: "Replacement exterior doors for damaged entrances.",
      item: validatedItems.EXTERIOR_DOOR,
      quantity: 30,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason: "Replace damaged doors after hurricane.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "cove-primary-measuring-tape-2025",
      title: "25 ft Measuring Tape",
      description: "Measuring tools for accurate construction and repair work.",
      item: validatedItems.MEASURING_TAPE,
      quantity: 20,
      type: "material",
      source: "external",
      priority: "medium",
      neededBy: {
        type: "asap",
        reason: "Essential for precise measurements during repairs.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "cove-primary-building-blocks-2025",
      title: "Building Blocks",
      description:
        "Educational toys for cognitive development and creative play.",
      item: validatedItems.BUILDING_BLOCKS,
      quantity: 60,
      type: "material",
      source: "external",
      priority: "medium",
      neededBy: {
        type: "asap",
        reason: "Replace lost educational resources after hurricane.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "cove-primary-crayola-play-dough-2025",
      title: "Crayola Play Dough",
      description:
        "Sensory learning materials for early childhood development activities.",
      item: validatedItems.CRAYOLA_PLAY_DOUGH,
      quantity: 61,
      type: "material",
      source: "external",
      priority: "medium",
      neededBy: {
        type: "asap",
        reason: "Replace lost teaching resources.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "cove-primary-fat-pencil-2025",
      title: "Fat Pencil",
      description: "Large pencils for early childhood writing development.",
      item: validatedItems.FAT_PENCIL,
      quantity: 50,
      type: "material",
      source: "external",
      priority: "medium",
      neededBy: {
        type: "asap",
        reason: "Essential for daily learning activities.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "cove-primary-pencils-pack-2025",
      title: "Pencils pack of 12",
      description:
        "Basic writing supplies for students to continue educational activities.",
      item: validatedItems.PENCILS_PACK,
      quantity: 150,
      type: "material",
      source: "external",
      priority: "medium",
      neededBy: {
        type: "asap",
        reason: "Essential for daily classroom activities.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "cove-primary-exercise-book-small-2025",
      title: "Exercise Book Small Fine line",
      description:
        "Small exercise books for student writing and homework activities.",
      item: validatedItems.EXERCISE_BOOK_SMALL,
      quantity: 200,
      type: "material",
      source: "external",
      priority: "medium",
      neededBy: {
        type: "asap",
        reason: "Essential for daily classroom activities and student work.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "cove-primary-exercise-book-big-2025",
      title: "Exercise Book Big",
      description:
        "Large exercise books for student writing and homework activities.",
      item: validatedItems.EXERCISE_BOOK_BIG,
      quantity: 200,
      type: "material",
      source: "external",
      priority: "medium",
      neededBy: {
        type: "asap",
        reason: "Essential for daily classroom activities and student work.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: now,
      updatedAt: now,
    },
    {
      slug: "cove-primary-double-line-book-2025",
      title: "Double Line Book",
      description:
        "Specialized writing books for handwriting practice and development.",
      item: validatedItems.DOUBLE_LINE_BOOK,
      quantity: 200,
      type: "material",
      source: "external",
      priority: "medium",
      neededBy: {
        type: "asap",
        reason: "Critical for proper handwriting development in students.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: now,
      updatedAt: now,
    },
  ],
};
