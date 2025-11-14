import type { Item } from "~/modules/core/items/types";

export const HARDWARE_ITEMS: Item[] = [
  {
    id: "relief-basic-hand-tools",
    name: "Basic Hand Tools",
    category: "hardware",
    unitLabel: "set",
    tags: ["relief", "tools", "cleanup"],
    description:
      "Drills, shovels, axes, hammers, and machetes packaged for recovery crews.",
  },
  {
    id: "maintenance-plyboard",
    name: "Plyboard Sheet",
    category: "hardware",
    tags: ["facilities", "maintenance", "construction"],
    unitLabel: "sheet",
    description: "3/4-inch plywood sheet for building repairs and maintenance.",
  },
  {
    id: "maintenance-zinc-roof-sheet",
    name: "Zinc Roofing Sheet",
    category: "hardware",
    tags: ["facilities", "maintenance", "roofing", "relief"],
    unitLabel: "sheet",
    description:
      "Corrugated metal roofing sheet suitable for emergency structural repairs.",
  },
  {
    id: "relief-tarpaulin-heavy-duty",
    name: "Heavy-Duty Tarpaulin",
    category: "hardware",
    tags: ["relief", "shelter", "weatherproofing"],
    unitLabel: "tarp",
    description:
      "Reinforced tarpaulin for temporary coverage of damaged classrooms and walkways.",
  },
  {
    id: "relief-door-trim-adhesive",
    name: "Door Trim Adhesive Protection",
    category: "hardware",
    tags: ["relief", "building", "adhesive"],
    attributes: { source: "Amazon" },
  },
  {
    id: "relief-roof-sealant",
    name: "Roof Sealant",
    category: "hardware",
    tags: ["relief", "building", "roofing"],
    attributes: { source: "Local" },
  },
  {
    id: "relief-hatchet-tools",
    name: "Hatchet / Cutting Tools",
    category: "hardware",
    tags: ["relief", "building", "cutting"],
  },
  {
    id: "relief-plywood",
    name: "Plywood",
    category: "hardware",
    unitLabel: "sheet",
    tags: ["relief", "building", "lumber"],
  },
  {
    id: "relief-tarps",
    name: "Tarps",
    category: "hardware",
    unitLabel: "tarp",
    tags: ["relief", "building", "weatherproofing"],
  },
  {
    id: "relief-nails",
    name: "Nails",
    category: "hardware",
    unitLabel: "box",
    tags: ["relief", "building", "fastener"],
  },
  {
    id: "relief-screws",
    name: "Screws",
    category: "hardware",
    unitLabel: "box",
    tags: ["relief", "building", "fastener"],
  },
  {
    id: "relief-general-tools",
    name: "Tools (General)",
    category: "hardware",
    tags: ["relief", "building", "tooling"],
  },
  {
    id: "relief-fuel-containers",
    name: "Fuel Containers",
    category: "hardware",
    unitLabel: "container",
    tags: ["relief", "power", "storage"],
    description:
      "Certified fuel cans for transporting gasoline or butane during response.",
  },
  {
    id: "relief-lumber",
    name: "Lumber",
    category: "hardware",
    unitLabel: "board",
    tags: ["relief", "building", "lumber"],
  },
];
