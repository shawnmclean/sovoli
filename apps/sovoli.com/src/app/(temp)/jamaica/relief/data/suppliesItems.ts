export interface SuppliesItem {
  id: string;
  name: string;
  category: "food" | "building" | "other";
  highPriority?: boolean;
  source?: string;
}

export const SUPPLIES_ITEMS: SuppliesItem[] = [
  // Food items
  { id: "canned-goods", name: "Canned Goods", category: "food" },
  { id: "rice", name: "Rice", category: "food", highPriority: true },
  { id: "beans", name: "Beans", category: "food" },
  { id: "water", name: "Bottled Water", category: "food", highPriority: true },
  {
    id: "baby-formula",
    name: "Baby Formula",
    category: "food",
    highPriority: true,
  },
  { id: "non-perishable", name: "Non-perishable Foods", category: "food" },
  // Building supplies
  {
    id: "door-trim-adhesive",
    name: "Door trim adhesive protection",
    category: "building",
    source: "Amazon",
  },
  {
    id: "roof-sealant",
    name: "Roof sealant",
    category: "building",
    source: "local",
  },
  {
    id: "hatchet-cutting-tools",
    name: "Hatchet/cutting tools for branches and debris",
    category: "building",
  },
  {
    id: "chainsaw",
    name: "Chainsaw - long blade for tree trunks",
    category: "building",
  },
  { id: "plywood", name: "Plywood", category: "building", highPriority: true },
  { id: "tarps", name: "Tarps", category: "building", highPriority: true },
  { id: "nails", name: "Nails", category: "building" },
  { id: "screws", name: "Screws", category: "building" },
  { id: "tools", name: "Tools", category: "building" },
  { id: "lumber", name: "Lumber", category: "building" },
  // Other supplies
  { id: "cleaning-cloths", name: "Cleaning cloths/towels", category: "other" },
  { id: "cleaning-products", name: "Cleaning products", category: "other" },
  { id: "sheets", name: "Sheets", category: "other" },
  { id: "sleeping-bags", name: "Sleeping bags", category: "other" },
  { id: "tents", name: "Tents", category: "other" },
  { id: "solar-lighting", name: "Solar lighting", category: "other" },
  { id: "insect-traps", name: "Insect traps", category: "other" },
  { id: "garbage-bags", name: "Garbage bags", category: "other" },
  { id: "storage-bins", name: "Storage bins", category: "other" },
];
