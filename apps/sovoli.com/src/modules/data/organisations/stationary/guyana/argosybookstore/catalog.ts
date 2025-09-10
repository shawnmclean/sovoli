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

export const ARGOSY_BOOK_STORE_CATALOG: CatalogModule = {
  items: [
    // Art and Creative Supplies (from images)
    createCatalogItem("supply-crayola-crayons-fat", { GYD: 1400, USD: 7 }),
    createCatalogItem("supply-crayola-crayons-fine", { GYD: 600, USD: 3 }),
    createCatalogItem("supply-drawing-book", { GYD: 100, USD: 0.5 }),
    createCatalogItem("supply-crayola-paint-6pcs", { GYD: 1500, USD: 7.5 }),
    createCatalogItem("supply-building-blocks", { GYD: 2000, USD: 10 }),
    createCatalogItem("supply-glue-elmers", { GYD: 440, USD: 2.2 }),

    // Writing and Paper Supplies (from images)
    createCatalogItem("supply-fat-pencil", { GYD: 100, USD: 0.5 }),
    createCatalogItem("supply-pencils-pack-12", { GYD: 340, USD: 1.7 }),
    createCatalogItem("supply-exercise-book-small-fine-line", {
      GYD: 100,
      USD: 0.5,
    }),
    createCatalogItem("supply-exercise-book-big", { GYD: 300, USD: 1.5 }),
    createCatalogItem("supply-double-line-book", { GYD: 100, USD: 0.5 }),

    // Educational Materials (from images)
    createCatalogItem("supply-pack-letters-numbers", { GYD: 1200, USD: 6 }),

    // Cardboard and Craft Materials (from images)
    createCatalogItem("supply-cardboard-lg", { GYD: 140, USD: 0.7 }),
    createCatalogItem("supply-cardboard-sml", { GYD: 40, USD: 0.2 }),

    // Educational Books - Pre-Nursery and Early Learning (from images)
    createCatalogItem("book-123-starters-coloring", { GYD: 680, USD: 3.4 }),
    createCatalogItem("book-big-easy-coloring", { GYD: 580, USD: 2.9 }),

    // Educational Books - Nursery Level (from images)
    createCatalogItem("book-animal-friends-level-1a-reader", {
      GYD: 240,
      USD: 1.2,
    }),
    createCatalogItem("book-animal-friends-level-1a-workbook-1", {
      GYD: 240,
      USD: 1.2,
    }),
    createCatalogItem("book-animal-friends-level-1a-workbook-2", {
      GYD: 240,
      USD: 1.2,
    }),
    createCatalogItem("book-animal-friends-level-1a-workbook-3", {
      GYD: 240,
      USD: 1.2,
    }),

    // Educational Books - Primary Level (from images)
    // Grade 1 Books
    createCatalogItem("book-mathematics-made-easy-1", { GYD: 2000, USD: 10 }),
    createCatalogItem("book-atlantic-reader-book-1", { GYD: 1300, USD: 6.5 }),
    createCatalogItem(
      "book-process-of-learning-language-arts-infant-first-year",
      { GYD: 2000, USD: 10 },
    ),
    createCatalogItem(
      "book-process-of-learning-composition-writing-infant-first-year",
      { GYD: 1500, USD: 7.5 },
    ),
    createCatalogItem("book-fun-with-language-book-1-parts-1-2-3", {
      GYD: 860,
      USD: 4.3,
    }),

    // Grade 2 Books
    createCatalogItem("book-mathematics-made-easy-2", { GYD: 2000, USD: 10 }),
    createCatalogItem(
      "book-process-of-learning-language-arts-infant-second-year",
      { GYD: 2000, USD: 10 },
    ),
    createCatalogItem(
      "book-process-of-learning-composition-writing-infant-second-year",
      { GYD: 1500, USD: 7.5 },
    ),
    createCatalogItem("book-fun-with-language-book-2-parts-1-2-3", {
      GYD: 860,
      USD: 4.3,
    }),

    // Grade 3 Books
    createCatalogItem("book-fun-with-language-book-3", { GYD: 1200, USD: 6 }),
    createCatalogItem("book-lets-do-mathematics-book-3", {
      GYD: 1300,
      USD: 6.5,
    }),
    createCatalogItem("book-social-studies-for-our-children-book-3", {
      GYD: 1000,
      USD: 5,
    }),
    createCatalogItem("book-science-around-us-book-3", { GYD: 1000, USD: 5 }),
    createCatalogItem("book-rainbow-readers-book-3", { GYD: 1000, USD: 5 }),
    createCatalogItem("book-word-perfect-spelling-book-3", {
      GYD: 500,
      USD: 2.5,
    }),
    createCatalogItem("book-nelson-west-indian-readers-book-3", {
      GYD: 1000,
      USD: 5,
    }),

    // Grade 4 Books
    createCatalogItem("book-fun-with-language-book-4", { GYD: 1200, USD: 6 }),
    createCatalogItem("book-lets-do-mathematics-book-4", {
      GYD: 1300,
      USD: 6.5,
    }),
    createCatalogItem("book-social-studies-for-our-children-book-4", {
      GYD: 1000,
      USD: 5,
    }),
    createCatalogItem("book-science-around-us-book-4", { GYD: 1000, USD: 5 }),
    createCatalogItem("book-rainbow-readers-book-4", { GYD: 1000, USD: 5 }),
    createCatalogItem("book-word-perfect-spelling-book-4", {
      GYD: 500,
      USD: 2.5,
    }),

    // Grade 5 Books
    createCatalogItem("book-fun-with-language-book-5", {
      GYD: 1200,
      USD: 6,
    }),
    createCatalogItem("book-social-studies-for-our-children-book-5", {
      GYD: 1000,
      USD: 5,
    }),
    createCatalogItem("book-science-around-us-book-5", {
      GYD: 1000,
      USD: 5,
    }),

    // Grade 6 Books
    createCatalogItem("book-fun-with-language-book-6", { GYD: 1200, USD: 6 }),
    createCatalogItem("book-lets-do-mathematics-book-6", {
      GYD: 1300,
      USD: 6.5,
    }),
    createCatalogItem("book-social-studies-for-our-children-book-6", {
      GYD: 1000,
      USD: 5,
    }),
    createCatalogItem("book-science-around-us-book-6", { GYD: 1000, USD: 5 }),
    createCatalogItem("book-new-junior-english-revised", {
      GYD: 1500,
      USD: 7.5,
    }),
    createCatalogItem("book-new-first-aid-in-english", { GYD: 1400, USD: 7 }),
    createCatalogItem("book-guyana-our-country-our-home", {
      GYD: 2800,
      USD: 14,
    }),

    // Reference Books (from images)
    createCatalogItem("book-oxford-primary-school-dictionary", {
      GYD: 2500,
      USD: 12.5,
    }),
    createCatalogItem("book-oxford-dictionary-thesaurus", {
      GYD: 3000,
      USD: 15,
    }),

    // Additional books from the price list (from images)
    createCatalogItem("book-nelson-west-indian-readers-book-2", {
      GYD: 1000,
      USD: 5,
    }),
    createCatalogItem("book-roraima-reader-literacy-year-2", {
      GYD: 1000,
      USD: 5,
    }),
    createCatalogItem("book-roraima-reader-literacy-year-1", {
      GYD: 1000,
      USD: 5,
    }),
    createCatalogItem("book-roraima-reader-numeracy-year-2", {
      GYD: 1000,
      USD: 5,
    }),
    createCatalogItem("book-roraima-reader-numeracy-year-1", {
      GYD: 1000,
      USD: 5,
    }),
    createCatalogItem("book-roraima-reader-writing-skills-book-1-2", {
      GYD: 1000,
      USD: 5,
    }),
    createCatalogItem("book-step-to-common-entrance-book-1", {
      GYD: 1000,
      USD: 5,
    }),
    createCatalogItem("book-step-to-common-entrance-book-2", {
      GYD: 1000,
      USD: 5,
    }),
    createCatalogItem("book-step-to-common-entrance-book-3", {
      GYD: 1000,
      USD: 5,
    }),
  ].filter((item): item is CatalogItem => item !== null),
};
