import type { InsertBook } from "@sovoli/db/schema";

import type { Book } from "./models";

/**
 * Transforms the ISBNdb API response into the InsertBookSchema for the database.
 * @param book - The book data from ISBNdb API.
 * @returns The transformed InsertBookSchema object.
 */
export const transformISBNdbToInsertBook = (book: Book): InsertBook => {
  return {
    isbn13: book.isbn13, // Ensure fallback to null if no isbn13
    isbn10: book.isbn, // ISBN10 field
    title: book.title, // Ensure fallback to null if title is missing
    longTitle: book.title_long ?? null, // Use title_long as longTitle if available
    language: book.language ?? null, // Language or null if not available
    image: book.image ?? null, // Image URL or null if not available
    dimensions: book.dimensions ?? null, // Text format dimensions if available
    structuredDimensions: book.dimensions_structured ?? null, // Structured dimensions
    pageCount: book.pages ?? 0, // Default to 0 if page count is not available
    subjects: book.subjects ?? [], // Empty array if no subjects provided
    authors: book.authors ?? [], // Empty array if no authors provided

    // Handle both full date strings and years
    publishedDate: book.date_published
      ? parsePublishedDate(book.date_published)
      : null,

    publisher: book.publisher ?? null, // Publisher or null if not available
    binding: book.binding ?? null, // Binding type (e.g., Hardcover, Paperback)
    otherISBNs: book.other_isbns ?? [], // Empty array if no other ISBNs provided
    description: book.overview ?? book.synopsis ?? null, // Use overview or synopsis for description
    subtitle: book.title_long ?? null, // Use title_long as subtitle if available
    lastISBNdbUpdated: new Date().toISOString(), // Use current date for the last update from ISBNdb
  };
};

/**
 * Helper function to handle full date strings or just a year.
 * If only a year is provided, assume January 1st of that year.
 * @param datePublished - The date or year from the API.
 * @returns A valid ISO date string or null if not valid.
 */
function parsePublishedDate(datePublished: string | number): string | null {
  // Check if the date is just a year (e.g., "2018")
  if (typeof datePublished === "number" || /^\d{4}$/.test(datePublished)) {
    return new Date(`${datePublished}-01-01`).toISOString();
  }

  // Handle full date strings (e.g., "2018-05-21")
  const fullDate = new Date(datePublished);
  return isNaN(fullDate.getTime()) ? null : fullDate.toISOString();
}
