export interface SuppliesItem {
  id: string;
  name: string;
  category: "food" | "building" | "other";
  highPriority?: boolean;
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
  { id: "plywood", name: "Plywood", category: "building", highPriority: true },
  { id: "tarps", name: "Tarps", category: "building", highPriority: true },
  { id: "nails", name: "Nails", category: "building" },
  { id: "screws", name: "Screws", category: "building" },
  { id: "tools", name: "Tools", category: "building" },
  { id: "lumber", name: "Lumber", category: "building" },
];
