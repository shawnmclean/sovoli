import type { CatalogModule, CatalogItem } from "~/modules/catalogs/types";
import { findItemById } from "~/modules/data/items";
import type { AmountByCurrency } from "~/modules/core/economics/types";

/**
 * Helper function to create a catalog item with pricing
 */
function createCatalogItem(
  id: string,
  price: AmountByCurrency,
): CatalogItem | null {
  const item = findItemById(id);
  if (!item) {
    console.warn(`Item with id "${id}" not found`);
    return null;
  }

  return {
    id,
    item,
    price,
  };
}

export const CREATIVE_THINKING_STATIONERY_HUB_CATALOG: CatalogModule = {
  items: [
    // Art and Creative Supplies
    createCatalogItem("supply-crayola-crayons-fat", { GYD: 1200, USD: 6 }),
    createCatalogItem("supply-crayola-crayons", { GYD: 1000, USD: 5 }),
    createCatalogItem("supply-crayola-play-dough", { GYD: 1800, USD: 9 }),
    createCatalogItem("supply-art-book", { GYD: 800, USD: 4 }),
    createCatalogItem("supply-drawing-book", { GYD: 800, USD: 4 }),
    createCatalogItem("supply-paint-set", { GYD: 1500, USD: 7.5 }),
    createCatalogItem("supply-building-blocks", { GYD: 2500, USD: 12.5 }),
    createCatalogItem("supply-pack-blocks", { GYD: 2000, USD: 10 }),
    createCatalogItem("supply-glue", { GYD: 400, USD: 2 }),

    // Writing and Paper Supplies
    createCatalogItem("supply-fat-pencil", { GYD: 200, USD: 1 }),
    createCatalogItem("supply-pencils", { GYD: 300, USD: 1.5 }),
    createCatalogItem("supply-pen-blue", { GYD: 250, USD: 1.25 }),
    createCatalogItem("supply-single-line-book", { GYD: 400, USD: 2 }),
    createCatalogItem("supply-fine-line-book", { GYD: 500, USD: 2.5 }),
    createCatalogItem("supply-4-line-book", { GYD: 450, USD: 2.25 }),
    createCatalogItem("supply-exercise-book", { GYD: 600, USD: 3 }),
    createCatalogItem("supply-double-line-book", { GYD: 600, USD: 3 }),
    createCatalogItem("supply-ruler", { GYD: 200, USD: 1 }),

    // Educational Materials
    createCatalogItem("supply-pack-letters", { GYD: 1000, USD: 5 }),
    createCatalogItem("supply-pack-numbers", { GYD: 1000, USD: 5 }),

    // Cardboard and Craft Materials
    createCatalogItem("supply-card-board-sheet", { GYD: 300, USD: 1.5 }),
    createCatalogItem("supply-sheet-card-boards", { GYD: 300, USD: 1.5 }),
    createCatalogItem("supply-sheet-card-board", { GYD: 300, USD: 1.5 }),
    createCatalogItem("supply-cardboard", { GYD: 300, USD: 1.5 }),

    // Hygiene and Cleaning Supplies
    createCatalogItem("supply-hand-sanitizer", { GYD: 600, USD: 3 }),
    createCatalogItem("supply-paper-towel", { GYD: 500, USD: 2.5 }),
    createCatalogItem("supply-tissue-paper-towel", { GYD: 500, USD: 2.5 }),
    createCatalogItem("supply-bounty-tissue", { GYD: 800, USD: 4 }),
    createCatalogItem("supply-liquid-soap", { GYD: 700, USD: 3.5 }),
    createCatalogItem("supply-soap", { GYD: 400, USD: 2 }),
    createCatalogItem("supply-detergent", { GYD: 800, USD: 4 }),
    createCatalogItem("supply-toilet-paper", { GYD: 400, USD: 2 }),

    // Educational Books - Pre-Nursery and Early Learning
    createCatalogItem("book-coloring-letters-numbers", { GYD: 1200, USD: 6 }),
    createCatalogItem("book-big-easy-coloring", { GYD: 1000, USD: 5 }),
    createCatalogItem("book-coloring-book", { GYD: 800, USD: 4 }),

    // Educational Books - Nursery Level
    createCatalogItem("book-animal-friends-level-a-reader", {
      GYD: 1500,
      USD: 7.5,
    }),
    createCatalogItem("book-animal-friends-level-a-workbook", {
      GYD: 1200,
      USD: 6,
    }),
    createCatalogItem("book-animal-readers", { GYD: 1400, USD: 7 }),
    createCatalogItem("book-roraima-nursery-year-1-literacy", {
      GYD: 1800,
      USD: 9,
    }),
    createCatalogItem("book-roraima-nursery-year-1-numeracy", {
      GYD: 1800,
      USD: 9,
    }),
    createCatalogItem("book-roraima-workbook-1-writing", { GYD: 1600, USD: 8 }),
    createCatalogItem("book-roraima-numeracy-workbook-book-2", {
      GYD: 1800,
      USD: 9,
    }),
    createCatalogItem("book-roraima-literacy-nursery-year-2", {
      GYD: 1800,
      USD: 9,
    }),

    // Educational Books - Primary Level
    // Grade 1 Books
    createCatalogItem("book-mathematics-made-easy-1", { GYD: 1800, USD: 9 }),
    createCatalogItem("book-atlantic-reader-book-1", { GYD: 1600, USD: 8 }),
    createCatalogItem("book-fun-with-language-book-1", { GYD: 2000, USD: 10 }),
    createCatalogItem("book-lets-do-mathematics-book-1", { GYD: 1800, USD: 9 }),
    createCatalogItem("book-social-studies-for-our-children-book-1", {
      GYD: 1800,
      USD: 9,
    }),
    createCatalogItem("book-science-around-us-book-1", { GYD: 1800, USD: 9 }),
    createCatalogItem("book-rainbow-readers-book-1", { GYD: 1600, USD: 8 }),
    createCatalogItem("book-word-perfect-spelling-book-1", {
      GYD: 1400,
      USD: 7,
    }),

    // Grade 2 Books
    createCatalogItem("book-mathematics-made-easy-2", { GYD: 2000, USD: 10 }),
    createCatalogItem("book-atlantic-reader-book-2", { GYD: 1800, USD: 9 }),
    createCatalogItem(
      "book-process-of-learning-language-arts-infant-second-year",
      { GYD: 2200, USD: 11 },
    ),
    createCatalogItem(
      "book-process-of-learning-composition-writing-infant-second-year",
      { GYD: 2000, USD: 10 },
    ),
    createCatalogItem("book-fun-with-language-book-2-parts-1-2-3", {
      GYD: 2400,
      USD: 12,
    }),
    createCatalogItem("book-lets-do-mathematics-book-2", {
      GYD: 2000,
      USD: 10,
    }),
    createCatalogItem("book-social-studies-for-our-children-book-2", {
      GYD: 1800,
      USD: 9,
    }),
    createCatalogItem("book-science-around-us-book-2", { GYD: 1800, USD: 9 }),
    createCatalogItem("book-rainbow-readers-book-2", { GYD: 1800, USD: 9 }),
    createCatalogItem("book-word-perfect-spelling-book-2", {
      GYD: 1500,
      USD: 7.5,
    }),
    createCatalogItem("book-steps-to-common-entrance-book-2", {
      GYD: 1800,
      USD: 9,
    }),

    // Grade 3 Books
    createCatalogItem("book-mathematics-made-easy-3", { GYD: 2100, USD: 10.5 }),
    createCatalogItem("book-atlantic-reader-book-3", { GYD: 1900, USD: 9.5 }),
    createCatalogItem("book-fun-with-language-book-3", { GYD: 2200, USD: 11 }),
    createCatalogItem("book-lets-do-mathematics-book-3", {
      GYD: 2100,
      USD: 10.5,
    }),
    createCatalogItem("book-social-studies-for-our-children-book-3", {
      GYD: 1900,
      USD: 9.5,
    }),
    createCatalogItem("book-science-around-us-book-3", { GYD: 1900, USD: 9.5 }),
    createCatalogItem("book-rainbow-readers-book-3", { GYD: 1900, USD: 9.5 }),
    createCatalogItem("book-word-perfect-spelling-book-3", {
      GYD: 1500,
      USD: 7.5,
    }),
    createCatalogItem("book-new-nelsons-west-indian-readers-book-3", {
      GYD: 2000,
      USD: 10,
    }),

    // Grade 4 Books
    createCatalogItem("book-mathematics-made-easy-4", { GYD: 2200, USD: 11 }),
    createCatalogItem("book-atlantic-reader-book-4", { GYD: 2000, USD: 10 }),
    createCatalogItem("book-fun-with-language-book-4", { GYD: 2600, USD: 13 }),
    createCatalogItem("book-lets-do-mathematics-book-4", {
      GYD: 2200,
      USD: 11,
    }),
    createCatalogItem("book-social-studies-for-our-children-book-4", {
      GYD: 2000,
      USD: 10,
    }),
    createCatalogItem("book-science-around-us-book-4", { GYD: 2000, USD: 10 }),
    createCatalogItem("book-rainbow-readers-book-4", { GYD: 1800, USD: 9 }),
    createCatalogItem("book-word-perfect-spelling-book-4", {
      GYD: 1600,
      USD: 8,
    }),
    createCatalogItem("book-new-nelsons-west-indian-readers-book-4", {
      GYD: 2100,
      USD: 10.5,
    }),

    // Grade 5 Books
    createCatalogItem("book-mathematics-made-easy-5", { GYD: 2300, USD: 11.5 }),
    createCatalogItem("book-atlantic-reader-book-5", { GYD: 2100, USD: 10.5 }),
    createCatalogItem("book-fun-with-language-book-5", {
      GYD: 2700,
      USD: 13.5,
    }),
    createCatalogItem("book-lets-do-mathematics-book-5", {
      GYD: 2300,
      USD: 11.5,
    }),
    createCatalogItem("book-social-studies-for-our-children-book-5", {
      GYD: 2100,
      USD: 10.5,
    }),
    createCatalogItem("book-science-around-us-book-5", {
      GYD: 2100,
      USD: 10.5,
    }),
    createCatalogItem("book-rainbow-readers-book-5", { GYD: 2000, USD: 10 }),
    createCatalogItem("book-word-perfect-spelling-book-5", {
      GYD: 1700,
      USD: 8.5,
    }),
    createCatalogItem("book-new-nelsons-west-indian-readers-book-5", {
      GYD: 2200,
      USD: 11,
    }),
    createCatalogItem("book-steps-to-common-entrance-book-3", {
      GYD: 2000,
      USD: 10,
    }),

    // Grade 6 Books
    createCatalogItem("book-mathematics-made-easy-6", { GYD: 2400, USD: 12 }),
    createCatalogItem("book-atlantic-reader-book-6", { GYD: 2200, USD: 11 }),
    createCatalogItem("book-fun-with-language-book-6", { GYD: 2800, USD: 14 }),
    createCatalogItem("book-lets-do-mathematics-book-6", {
      GYD: 2400,
      USD: 12,
    }),
    createCatalogItem("book-social-studies-for-our-children-book-6", {
      GYD: 2200,
      USD: 11,
    }),
    createCatalogItem("book-science-around-us-book-6", { GYD: 2200, USD: 11 }),
    createCatalogItem("book-rainbow-readers-book-6", { GYD: 2200, USD: 11 }),
    createCatalogItem("book-word-perfect-spelling-book-6", {
      GYD: 1800,
      USD: 9,
    }),
    createCatalogItem("book-new-nelsons-west-indian-readers-book-6", {
      GYD: 2300,
      USD: 11.5,
    }),
    createCatalogItem("book-new-junior-english", { GYD: 2400, USD: 12 }),
    createCatalogItem("book-new-first-aid", { GYD: 2000, USD: 10 }),
    createCatalogItem("book-guyana-our-country-our-home", {
      GYD: 1800,
      USD: 9,
    }),
    createCatalogItem("book-steps-to-common-entrance-book-4", {
      GYD: 2200,
      USD: 11,
    }),

    // Reference Books
    createCatalogItem("book-dictionary-oxford", { GYD: 3000, USD: 15 }),
    createCatalogItem("book-dictionary-and-thesaurus", { GYD: 3200, USD: 16 }),
  ].filter((item): item is CatalogItem => item !== null),
};
