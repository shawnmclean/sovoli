/**
 * MASTER CATEGORY TREE (SOVOLI)
 * -------------------------------------------
 * This tree supports:
 *  - schools (academic + stationery + operations)
 *  - disaster relief (hardware + roofing + bedding + hygiene + food)
 *  - NGO procurement (medical, facility, sanitation)
 *  - store onboarding (stationery vendors, hardware vendors)
 *  - pricing intake (category-driven filtering)
 */

import type {
  CategoryDefinition,
  ItemCategory,
} from "~/modules/core/items/types";
import type { OrgCategoryKeys } from "~/modules/organisations/types";

export const CATEGORY_TREE: CategoryDefinition[] = [
  //
  // ACADEMIC & EDUCATION
  //
  {
    id: "academic",
    name: "Academic",
    children: [
      { id: "textbooks", name: "Textbooks", parentId: "academic" },
      { id: "workbooks", name: "Workbooks", parentId: "academic" },
      { id: "readers", name: "Readers", parentId: "academic" },
      {
        id: "teacher-resources",
        name: "Teacher Resources",
        parentId: "academic",
      },
    ],
  },

  //
  // STATIONERY / SCHOOL SUPPLIES
  //
  {
    id: "stationery",
    name: "Stationery & School Supplies",
    children: [
      { id: "pens", name: "Pens", parentId: "stationery" },
      { id: "pencils", name: "Pencils", parentId: "stationery" },
      { id: "crayons", name: "Crayons", parentId: "stationery" },
      { id: "markers", name: "Markers", parentId: "stationery" },
      { id: "paper", name: "Paper", parentId: "stationery" },
      { id: "notebooks", name: "Notebooks", parentId: "stationery" },
      { id: "geometry", name: "Geometry Sets", parentId: "stationery" },
      { id: "art-supplies", name: "Art Supplies", parentId: "stationery" },
    ],
  },

  //
  // HARDWARE (core for relief and repairs)
  //
  {
    id: "hardware",
    name: "Hardware",
    children: [
      //
      // Lumber & Structural Materials
      //
      {
        id: "lumber",
        name: "Lumber",
        parentId: "hardware",
        children: [
          { id: "plywood", name: "Plywood", parentId: "lumber" },
          { id: "boards", name: "Boards", parentId: "lumber" },
          { id: "framing", name: "Framing Lumber", parentId: "lumber" },
        ],
      },

      //
      // Roofing materials
      //
      {
        id: "roofing",
        name: "Roofing",
        parentId: "hardware",
        children: [
          { id: "zinc", name: "Zinc Sheets", parentId: "roofing" },
          { id: "shingles", name: "Shingles", parentId: "roofing" },
          { id: "roof-sealant", name: "Roof Sealant", parentId: "roofing" },
        ],
      },

      //
      // Tools
      //
      {
        id: "tools",
        name: "Tools",
        parentId: "hardware",
        children: [
          { id: "hand-tools", name: "Hand Tools", parentId: "tools" },
          { id: "cutting-tools", name: "Cutting Tools", parentId: "tools" },
          { id: "power-tools", name: "Power Tools", parentId: "tools" },
          { id: "toolkits", name: "Tool Kits", parentId: "tools" },
        ],
      },

      //
      // Electrical
      //
      {
        id: "electrical",
        name: "Electrical",
        parentId: "hardware",
        children: [
          { id: "cables", name: "Cables", parentId: "electrical" },
          { id: "sockets", name: "Sockets & Outlets", parentId: "electrical" },
          { id: "switches", name: "Switches", parentId: "electrical" },
          { id: "fixtures", name: "Light Fixtures", parentId: "electrical" },
          { id: "breakers", name: "Breakers", parentId: "electrical" },
        ],
      },

      //
      // Plumbing
      //
      {
        id: "plumbing",
        name: "Plumbing",
        parentId: "hardware",
        children: [
          { id: "pipes", name: "Pipes", parentId: "plumbing" },
          { id: "fittings", name: "Fittings", parentId: "plumbing" },
          { id: "faucets", name: "Faucets", parentId: "plumbing" },
        ],
      },

      //
      // Fasteners & Consumables
      //
      {
        id: "fasteners",
        name: "Fasteners",
        parentId: "hardware",
        children: [
          { id: "nails", name: "Nails", parentId: "fasteners" },
          { id: "screws", name: "Screws", parentId: "fasteners" },
          { id: "bolts", name: "Bolts", parentId: "fasteners" },
        ],
      },

      { id: "adhesives", name: "Adhesives & Sealants", parentId: "hardware" },
    ],
  },

  //
  // FACILITY & OPERATIONS
  //
  {
    id: "facility",
    name: "Facility Supplies",
    children: [
      { id: "cleaning", name: "Cleaning Supplies", parentId: "facility" },
      { id: "waste", name: "Waste Management", parentId: "facility" },
      { id: "safety", name: "Safety Gear", parentId: "facility" },
    ],
  },

  //
  // BEDDING (used heavily in shelters during disasters)
  //
  {
    id: "bedding",
    name: "Bedding",
    children: [
      { id: "mattress", name: "Mattress", parentId: "bedding" },
      { id: "bedsheet", name: "Bed Sheet", parentId: "bedding" },
      { id: "pillow", name: "Pillow", parentId: "bedding" },
      { id: "blanket", name: "Blanket", parentId: "bedding" },
    ],
  },

  //
  // HYGIENE / RELIEF
  //
  {
    id: "hygiene",
    name: "Hygiene",
    children: [
      { id: "soap", name: "Soap", parentId: "hygiene" },
      { id: "bleach", name: "Bleach", parentId: "hygiene" },
      { id: "sanitizer", name: "Sanitizer", parentId: "hygiene" },
      { id: "tissue", name: "Tissue & Paper", parentId: "hygiene" },
    ],
  },

  //
  // FOOD & SUPPLIES
  //
  { id: "food", name: "Food & Nutrition" },

  //
  // MEDICAL
  //
  { id: "medical", name: "Medical Supplies" },

  //
  // OTHER / SERVICES
  //
  { id: "service", name: "Services" },
  { id: "other", name: "Other" },
];

export function flattenCategoryTree(
  nodes: CategoryDefinition[],
  output: Record<string, CategoryDefinition> = {},
): Record<string, CategoryDefinition> {
  for (const node of nodes) {
    output[node.id] = {
      id: node.id,
      name: node.name,
      parentId: node.parentId,
    };

    if (node.children) {
      flattenCategoryTree(node.children, output);
    }
  }
  return output;
}

export const CATEGORY_INDEX = flattenCategoryTree(CATEGORY_TREE);

export function hydrateCategory(categoryId: string): ItemCategory {
  const def = CATEGORY_INDEX[categoryId];
  if (!def) throw new Error(`Unknown category: ${categoryId}`);

  return {
    id: def.id,
    name: def.name,
    parent: def.parentId ? hydrateCategory(def.parentId) : undefined,
  };
}
