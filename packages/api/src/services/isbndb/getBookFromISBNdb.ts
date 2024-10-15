import type { InsertBook } from "@sovoli/db/schema";

import { env } from "../../env";
import { AsyncResilience } from "../../utils/retry/AsyncResilience";
import { retryAsync } from "../../utils/retry/retry-async";

// Represents the structured dimensions of a book (length, width, height, weight)
interface DimensionsStructured {
  length: {
    unit: string;
    value: number;
  };
  width: {
    unit: string;
    value: number;
  };
  height: {
    unit: string;
    value: number;
  };
  weight: {
    unit: string;
    value: number;
  };
}

// Represents the pricing information for a book from different merchants
interface Price {
  condition: string;
  merchant: string;
  merchant_logo: string;
  merchant_logo_offset: {
    x: string;
    y: string;
  };
  shipping: string;
  price: string;
  total: string;
  link: string;
}

// Represents alternative ISBNs for a book
interface OtherISBN {
  isbn: string;
  binding: string;
}

// Represents the full structure of a book in the response
interface Book {
  title: string; // Title of the book
  title_long?: string; // Long version of the title (if any)
  isbn: string; // ISBN-10
  isbn13: string; // ISBN-13
  dewey_decimal?: string; // Dewey Decimal Classification
  binding?: string; // Binding type (e.g., Hardcover, Paperback)
  publisher?: string; // Publisher's name
  language?: string; // Language of the book
  date_published?: string | number; // Date the book was published
  edition?: string; // Edition of the book
  pages?: number; // Number of pages
  dimensions?: string; // Dimensions in text format
  dimensions_structured?: DimensionsStructured; // Structured dimensions
  overview?: string; // Overview of the book
  image?: string; // URL to the book's cover image
  msrp?: number; // Manufacturer's suggested retail price (MSRP)
  excerpt?: string; // Excerpt from the book
  synopsis?: string; // Synopsis of the book
  authors?: string[]; // List of authors
  subjects?: string[]; // List of subjects or categories
  reviews?: string[]; // List of reviews
  prices?: Price[]; // List of prices from different merchants
  related?: {
    // Related book type
    type: string;
  };
  other_isbns?: OtherISBN[]; // List of alternative ISBNs with binding types
}

// Response object structure for getBookByISBN
export interface GetBookFromISBNdbResponse {
  book: Book; // Book object for the given ISBN
}

export interface GetBookFromISBNdbOptions {
  isbn: string;
}

export const getBookFromISBNdb = async ({
  isbn,
}: GetBookFromISBNdbOptions): Promise<InsertBook | null> => {
  const apiKey = env.ISBN_DB_API_KEY;
  const url = `https://api2.isbndb.com/book/${isbn}`;

  const fetchBookFunc = async () => {
    const response = await fetch(url, {
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 429) {
      throw new Error("Rate limit hit");
    }

    return response;
  };

  const response = await retryAsync(
    fetchBookFunc,
    AsyncResilience.exponentialBackoffWithJitter(),
  );

  if (!response.ok) {
    console.error(response);
    throw new Error("Failed to fetch book data");
  }

  const data = (await response.json()) as GetBookFromISBNdbResponse;
  return transformISBNdbToInsertBookSchema(data.book);
};

/**
 * Transforms the ISBNdb API response into the InsertBookSchema for the database.
 * @param book - The book data from ISBNdb API.
 * @returns The transformed InsertBookSchema object.
 */
export const transformISBNdbToInsertBookSchema = (book: Book): InsertBook => {
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
