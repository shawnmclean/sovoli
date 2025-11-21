import { findItemById } from "~/modules/data/items";
import type { NeedsModule } from "~/modules/needs/types";

// Construction and roofing materials
const INDUSTRIAL_ROOF_SHEETING = findItemById("industrial-roof-sheeting");
const ZINC_RIDGE_CAP = findItemById("ridge-cap-12ft");
const ROOF_SEALANT = findItemById("roof-sealant");
const ROOFING_SCREWS_WASHERS = findItemById(
  "maintenance-zinc-roof-screws-2-5in",
);
const ROOFING_SCREWS = findItemById("relief-screws");
const STRUCTURAL_SCREWS = findItemById("structural-screws-4in");
const ROOFING_NAILS = findItemById("roofing-nails-2-5in");
const HURRICANE_STRAP_NAILS = findItemById("strap-nails-3in");
const PLYBOARD_SHEET = findItemById("maintenance-plyboard");
const LUMBER_2X2X12 = findItemById("lumber-2x2x12");
const LUMBER_2X6X12 = findItemById("lumber-2x6x12");
const LUMBER_2X4X12 = findItemById("lumber-2x4x12");
const PLYWOOD_3_4_4X8 = findItemById("plywood-3-4-4x8");
const EXTERIOR_DOOR = findItemById("exterior-door-36x80");

// Educational supplies - art and craft
const CRAYOLA_CRAYONS_FAT = findItemById("supply-crayola-crayons-fat");
const CRAYOLA_CRAYONS_FINE = findItemById("supply-crayola-crayons-fine");
const CRAYOLA_PAINT = findItemById("supply-crayola-paint-6pcs");
const GLUE_ELMERS = findItemById("supply-glue-elmers");
const CARDBOARD_LG = findItemById("supply-cardboard-lg");
const DRAFTING_PAPER = findItemById("supply-drafting-paper");
const DRAWING_BOOK = findItemById("supply-drawing-book");
const BUILDING_BLOCKS = findItemById("supply-building-blocks");
const CRAYOLA_PLAY_DOUGH = findItemById("supply-crayola-play-dough");

// Educational supplies - stationery
const FAT_PENCIL = findItemById("supply-fat-pencil");
const PENCILS_PACK = findItemById("supply-pencils-pack-12");
const EXERCISE_BOOK_SMALL = findItemById(
  "supply-exercise-book-small-fine-line",
);
const EXERCISE_BOOK_BIG = findItemById("supply-exercise-book-big");
const DOUBLE_LINE_BOOK = findItemById("supply-double-line-book");

// Tools
const IMPACT_DRIVER = findItemById("impact-driver");
const TIN_SNIPS = findItemById("tin-snips");

// Validation for required items
const requiredItems = [
  { item: INDUSTRIAL_ROOF_SHEETING, id: "industrial-roof-sheeting" },
  { item: ZINC_RIDGE_CAP, id: "ridge-cap-12ft" },
  { item: ROOF_SEALANT, id: "roof-sealant" },
  { item: ROOFING_SCREWS_WASHERS, id: "maintenance-zinc-roof-screws-2-5in" },
  { item: ROOFING_SCREWS, id: "relief-screws" },
  { item: STRUCTURAL_SCREWS, id: "structural-screws-4in" },
  { item: ROOFING_NAILS, id: "roofing-nails-2-5in" },
  { item: HURRICANE_STRAP_NAILS, id: "strap-nails-3in" },
  { item: PLYBOARD_SHEET, id: "maintenance-plyboard" },
  { item: LUMBER_2X2X12, id: "lumber-2x2x12" },
  { item: LUMBER_2X6X12, id: "lumber-2x6x12" },
  { item: LUMBER_2X4X12, id: "lumber-2x4x12" },
  { item: PLYWOOD_3_4_4X8, id: "plywood-3-4-4x8" },
  { item: EXTERIOR_DOOR, id: "exterior-door-36x80" },
  { item: CRAYOLA_CRAYONS_FAT, id: "supply-crayola-crayons-fat" },
  { item: CRAYOLA_CRAYONS_FINE, id: "supply-crayola-crayons-fine" },
  { item: CRAYOLA_PAINT, id: "supply-crayola-paint-6pcs" },
  { item: GLUE_ELMERS, id: "supply-glue-elmers" },
  { item: CARDBOARD_LG, id: "supply-cardboard-lg" },
  { item: DRAFTING_PAPER, id: "supply-drafting-paper" },
  { item: DRAWING_BOOK, id: "supply-drawing-book" },
  { item: BUILDING_BLOCKS, id: "supply-building-blocks" },
  { item: CRAYOLA_PLAY_DOUGH, id: "supply-crayola-play-dough" },
  { item: FAT_PENCIL, id: "supply-fat-pencil" },
  { item: PENCILS_PACK, id: "supply-pencils-pack-12" },
  { item: EXERCISE_BOOK_SMALL, id: "supply-exercise-book-small-fine-line" },
  { item: EXERCISE_BOOK_BIG, id: "supply-exercise-book-big" },
  { item: DOUBLE_LINE_BOOK, id: "supply-double-line-book" },
  { item: IMPACT_DRIVER, id: "impact-driver" },
  { item: TIN_SNIPS, id: "tin-snips" },
];

for (const { item, id } of requiredItems) {
  if (!item) {
    throw new Error(`${id} item is missing from core items.`);
  }
}

// Type assertions after validation
const validatedItems = {
  INDUSTRIAL_ROOF_SHEETING: INDUSTRIAL_ROOF_SHEETING!,
  ZINC_RIDGE_CAP: ZINC_RIDGE_CAP!,
  ROOF_SEALANT: ROOF_SEALANT!,
  ROOFING_SCREWS_WASHERS: ROOFING_SCREWS_WASHERS!,
  ROOFING_SCREWS: ROOFING_SCREWS!,
  STRUCTURAL_SCREWS: STRUCTURAL_SCREWS!,
  ROOFING_NAILS: ROOFING_NAILS!,
  HURRICANE_STRAP_NAILS: HURRICANE_STRAP_NAILS!,
  PLYBOARD_SHEET: PLYBOARD_SHEET!,
  LUMBER_2X2X12: LUMBER_2X2X12!,
  LUMBER_2X6X12: LUMBER_2X6X12!,
  LUMBER_2X4X12: LUMBER_2X4X12!,
  PLYWOOD_3_4_4X8: PLYWOOD_3_4_4X8!,
  EXTERIOR_DOOR: EXTERIOR_DOOR!,
  CRAYOLA_CRAYONS_FAT: CRAYOLA_CRAYONS_FAT!,
  CRAYOLA_CRAYONS_FINE: CRAYOLA_CRAYONS_FINE!,
  CRAYOLA_PAINT: CRAYOLA_PAINT!,
  GLUE_ELMERS: GLUE_ELMERS!,
  CARDBOARD_LG: CARDBOARD_LG!,
  DRAFTING_PAPER: DRAFTING_PAPER!,
  DRAWING_BOOK: DRAWING_BOOK!,
  BUILDING_BLOCKS: BUILDING_BLOCKS!,
  CRAYOLA_PLAY_DOUGH: CRAYOLA_PLAY_DOUGH!,
  FAT_PENCIL: FAT_PENCIL!,
  PENCILS_PACK: PENCILS_PACK!,
  EXERCISE_BOOK_SMALL: EXERCISE_BOOK_SMALL!,
  EXERCISE_BOOK_BIG: EXERCISE_BOOK_BIG!,
  DOUBLE_LINE_BOOK: DOUBLE_LINE_BOOK!,
  IMPACT_DRIVER: IMPACT_DRIVER!,
  TIN_SNIPS: TIN_SNIPS!,
};

export const OLYMPUS_ACADEMY_NEEDS: NeedsModule = {
  needs: [
    // Major construction materials
    {
      slug: "olympusacademy-industrial-roof-sheeting-2025",
      title: "Industrial Roof Sheeting (Square)",
      description:
        "Industrial-grade roof sheeting for complete roof replacement after total destruction.",
      item: validatedItems.INDUSTRIAL_ROOF_SHEETING,
      quantity: 306,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason:
          "Roof of some buildings totally gone. Critical for weather protection.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "olympusacademy-zinc-ridge-cap-2025",
      title: "Zinc Ridge Cap - 12 ft",
      description: "Ridge caps for proper roof sealing and weather protection.",
      item: validatedItems.ZINC_RIDGE_CAP,
      quantity: 21,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason: "Essential for complete roof restoration and waterproofing.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "olympusacademy-roof-sealant-2025",
      title: "Roof Sealant",
      description: "Waterproofing sealant for roof joints and leak prevention.",
      item: validatedItems.ROOF_SEALANT,
      quantity: 21,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason: "Critical for waterproofing after total roof destruction.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "olympusacademy-roofing-screws-washers-2025",
      title: "Roofing Screws w/ Washers - 2.5 in",
      description:
        "Self-drilling screws with washers for secure roofing installation.",
      item: validatedItems.ROOFING_SCREWS_WASHERS,
      quantity: 31,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason: "Required for proper roof sheet fastening and installation.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "olympusacademy-roofing-screws-2025",
      title: "Roofing Screws",
      description: "Additional roofing screws for comprehensive roof repair.",
      item: validatedItems.ROOFING_SCREWS,
      quantity: 51,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason: "Essential for securing roofing materials during rebuild.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "olympusacademy-structural-screws-2025",
      title: "Structural Screws - 4 in",
      description:
        "Heavy-duty structural screws for framing and structural repairs.",
      item: validatedItems.STRUCTURAL_SCREWS,
      quantity: 21,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason: "Required for structural rebuilding of damaged classrooms.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "olympusacademy-roofing-nails-2025",
      title: "Galvanized Roofing Nails - 2.5 in",
      description: "Galvanized nails for roofing and structural work.",
      item: validatedItems.ROOFING_NAILS,
      quantity: 41,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason: "Needed for roof batten installation and structural work.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "olympusacademy-hurricane-strap-nails-2025",
      title: "Hurricane Strap Nails - 3 in",
      description:
        "Heavy-duty nails for hurricane strapping and structural connections.",
      item: validatedItems.HURRICANE_STRAP_NAILS,
      quantity: 84,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason:
          "Critical for hurricane-resistant structural connections and safety.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "olympusacademy-plyboard-sheet-2025",
      title: "Plyboard Sheet",
      description:
        "Plywood sheets for structural repairs and interior rebuilding.",
      item: validatedItems.PLYBOARD_SHEET,
      quantity: 61,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason:
          "Essential for rebuilding interior walls and structural elements.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "olympusacademy-lumber-2x2x12-2025",
      title: "2x2x12 ft Treated Lumber",
      description: "Treated lumber for framing and structural work.",
      item: validatedItems.LUMBER_2X2X12,
      quantity: 51,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason: "Required for roof framing and structural repairs.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "olympusacademy-lumber-2x6x12-2025",
      title: "2x6x12 ft Framing Lumber",
      description: "Heavy framing lumber for structural rebuilding.",
      item: validatedItems.LUMBER_2X6X12,
      quantity: 31,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason: "Essential for major structural framing and roof support.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "olympusacademy-lumber-2x4x12-2025",
      title: "2x4x12 ft Framing Lumber",
      description: "Standard framing lumber for wall and ceiling construction.",
      item: validatedItems.LUMBER_2X4X12,
      quantity: 25,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason: "Required for wall framing and interior reconstruction.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "olympusacademy-plywood-3-4-4x8-2025",
      title: "3/4 in Plywood - 4x8 ft",
      description: "Thick plywood sheets for flooring and structural work.",
      item: validatedItems.PLYWOOD_3_4_4X8,
      quantity: 41,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason: "Needed for flooring replacement and structural sheathing.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "olympusacademy-exterior-door-2025",
      title: "Exterior Door - 36x80",
      description: "Replacement exterior doors for damaged entrances.",
      item: validatedItems.EXTERIOR_DOOR,
      quantity: 7,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason: "Essential for security and weather protection of classrooms.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // Educational supplies - Art and craft materials
    {
      slug: "olympusacademy-crayola-crayons-fat-2025",
      title: "Crayola Crayons (Fat)",
      description:
        "Fat crayons for early childhood education and art activities.",
      item: validatedItems.CRAYOLA_CRAYONS_FAT,
      quantity: 11,
      type: "material",
      source: "external",
      priority: "medium",
      neededBy: {
        type: "asap",
        reason:
          "All teaching and learning resources destroyed, need to restore educational activities.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "olympusacademy-crayola-crayons-fine-2025",
      title: "Crayola Crayons Fine",
      description: "Fine crayons for detailed art work and older students.",
      item: validatedItems.CRAYOLA_CRAYONS_FINE,
      quantity: 11,
      type: "material",
      source: "external",
      priority: "medium",
      neededBy: {
        type: "asap",
        reason: "Essential for restoring art education programs.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "olympusacademy-crayola-paint-2025",
      title: "Crayola Paint 6pcs",
      description: "Paint sets for art education and creative activities.",
      item: validatedItems.CRAYOLA_PAINT,
      quantity: 11,
      type: "material",
      source: "external",
      priority: "medium",
      neededBy: {
        type: "asap",
        reason: "Required for comprehensive art education restoration.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "olympusacademy-glue-elmers-2025",
      title: "Glue Elmer's",
      description: "Adhesive for craft projects and educational activities.",
      item: validatedItems.GLUE_ELMERS,
      quantity: 21,
      type: "material",
      source: "external",
      priority: "medium",
      neededBy: {
        type: "asap",
        reason: "Essential for craft activities and educational projects.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "olympusacademy-cardboard-lg-2025",
      title: "Cardboard Lg",
      description: "Large cardboard sheets for craft and display projects.",
      item: validatedItems.CARDBOARD_LG,
      quantity: 21,
      type: "material",
      source: "external",
      priority: "medium",
      neededBy: {
        type: "asap",
        reason: "Needed for educational displays and craft activities.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "olympusacademy-drafting-paper-2025",
      title: "Drafting Paper",
      description: "Specialized paper for technical drawing and design work.",
      item: validatedItems.DRAFTING_PAPER,
      quantity: 21,
      type: "material",
      source: "external",
      priority: "medium",
      neededBy: {
        type: "asap",
        reason: "Required for technical education and drawing activities.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "olympusacademy-drawing-book-2025",
      title: "Drawing Book",
      description: "Drawing books for art education and creative expression.",
      item: validatedItems.DRAWING_BOOK,
      quantity: 41,
      type: "material",
      source: "external",
      priority: "medium",
      neededBy: {
        type: "asap",
        reason: "Essential for art education and student creative work.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "olympusacademy-building-blocks-2025",
      title: "Building Blocks",
      description:
        "Educational building blocks for cognitive development and learning.",
      item: validatedItems.BUILDING_BLOCKS,
      quantity: 41,
      type: "material",
      source: "external",
      priority: "medium",
      neededBy: {
        type: "asap",
        reason:
          "Important for hands-on learning and cognitive development activities.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "olympusacademy-crayola-play-dough-2025",
      title: "Crayola Play Dough",
      description:
        "Play dough for sensory learning and motor skills development.",
      item: validatedItems.CRAYOLA_PLAY_DOUGH,
      quantity: 21,
      type: "material",
      source: "external",
      priority: "medium",
      neededBy: {
        type: "asap",
        reason: "Essential for early childhood development activities.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // Educational supplies - Stationery
    {
      slug: "olympusacademy-fat-pencil-2025",
      title: "Fat Pencil",
      description: "Fat pencils for early childhood writing development.",
      item: validatedItems.FAT_PENCIL,
      quantity: 21,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason: "Critical for early writing skills development.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "olympusacademy-pencils-pack-2025",
      title: "Pencils pack of 12",
      description: "Standard pencil packs for daily writing activities.",
      item: validatedItems.PENCILS_PACK,
      quantity: 15,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason: "Essential for daily classroom writing activities.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "olympusacademy-exercise-book-small-2025",
      title: "Exercise Book Small Fine line",
      description: "Small exercise books for student work and assignments.",
      item: validatedItems.EXERCISE_BOOK_SMALL,
      quantity: 51,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason: "Required for daily student assignments and classwork.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "olympusacademy-exercise-book-big-2025",
      title: "Exercise Book Big",
      description: "Large exercise books for extensive writing assignments.",
      item: validatedItems.EXERCISE_BOOK_BIG,
      quantity: 51,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason: "Essential for comprehensive student work and projects.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "olympusacademy-double-line-book-2025",
      title: "Double Line Book",
      description:
        "Double line books for handwriting practice and development.",
      item: validatedItems.DOUBLE_LINE_BOOK,
      quantity: 41,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason:
          "Critical for proper handwriting development in young students.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // Tools
    {
      slug: "olympusacademy-impact-driver-2025",
      title: "18V Cordless Impact Driver",
      description: "Power tools for construction and repair work.",
      item: validatedItems.IMPACT_DRIVER,
      quantity: 2,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason: "Essential for construction and structural repair work.",
      },
      requestingUnit: {
        locationKey: "main-campus",
      },
      status: "planned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      slug: "olympusacademy-tin-snips-2025",
      title: "Tin Snips",
      description: "Cutting tools for metal roofing and construction work.",
      item: validatedItems.TIN_SNIPS,
      quantity: 1,
      type: "material",
      source: "external",
      priority: "high",
      neededBy: {
        type: "asap",
        reason: "Required for cutting and fitting roofing materials.",
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
