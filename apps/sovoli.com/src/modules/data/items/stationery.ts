import type { Item } from "~/modules/core/items/types";
import { hydrateCategory } from "./categories";

export const STATIONERY_ITEMS: Item[] = [
  {
    id: "relief-basic-school-supplies",
    name: "Basic School Supplies",
    category: hydrateCategory("stationery"),
    unitLabel: "kit",
    tags: ["relief", "stationery", "school"],
    description:
      "Pens, pencils, exercise books, and other essentials for displaced students.",
  },
  {
    id: "supply-fat-pencil",
    name: "Fat Pencil",
    category: hydrateCategory("pencils"),
    tags: ["stationery", "pencil"],
  },
  {
    id: "supply-single-line-book",
    name: "Single Line Book",
    category: hydrateCategory("notebooks"),
    tags: ["stationery", "copybook"],
  },
  {
    id: "supply-exercise-book-big",
    name: "Exercise Book Big",
    category: hydrateCategory("notebooks"),
    tags: ["stationery", "copybook", "exercise"],
    unitLabel: "book",
  },
  {
    id: "supply-double-line-book",
    name: "Double Line Book",
    category: hydrateCategory("notebooks"),
    tags: ["stationery", "copybook", "double-line"],
    unitLabel: "book",
  },
  {
    id: "supply-exercise-book-small-fine-line",
    name: "Exercise Book Small Fine line",
    category: hydrateCategory("notebooks"),
    tags: ["stationery", "copybook", "exercise"],
    unitLabel: "book",
  },
  {
    id: "supply-4-line-book",
    name: "4 Line Book",
    category: hydrateCategory("notebooks"),
    tags: ["stationery", "copybook"],
  },
  {
    id: "supply-pencils-pack-12",
    name: "Pencils pack of 12",
    category: hydrateCategory("pencils"),
    tags: ["stationery", "pencil"],
    unitLabel: "pack",
  },
  {
    id: "supply-straight-ruler",
    name: "Straight Ruler",
    category: hydrateCategory("geometry"),
    tags: ["measuring", "ruler", "straight"],
  },
  {
    id: "supply-french-curve",
    name: "French Curve Ruler",
    category: hydrateCategory("geometry"),
    tags: ["measuring", "ruler", "curve", "french"],
  },
  {
    id: "supply-erasers",
    name: "Erasers",
    category: hydrateCategory("pens"),
    tags: ["stationery", "eraser"],
  },
  {
    id: "supply-protractor",
    name: "Protractor",
    category: hydrateCategory("geometry"),
    tags: ["stationery", "protractor", "geometry", "math"],
    unitLabel: "unit",
  },
  {
    id: "supply-compass",
    name: "Compass",
    category: hydrateCategory("geometry"),
    tags: ["stationery", "compass", "geometry", "math"],
    unitLabel: "unit",
  },
];
