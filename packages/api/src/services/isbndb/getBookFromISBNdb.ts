import { env } from "../../env";
import { AsyncResilience } from "../../utils/retry/AsyncResilience";
import { retryAsync } from "../../utils/retry/retry-async";

// Represents the structured dimensions of a book (length, width, height, weight)
export interface DimensionsStructured {
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
export interface Price {
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
export interface OtherISBN {
  isbn: string;
  binding: string;
}

// Represents the full structure of a book in the response
export interface Book {
  title: string; // Title of the book
  title_long?: string; // Long version of the title (if any)
  isbn: string; // ISBN-10
  isbn13: string; // ISBN-13
  dewey_decimal?: string; // Dewey Decimal Classification
  binding?: string; // Binding type (e.g., Hardcover, Paperback)
  publisher?: string; // Publisher's name
  language?: string; // Language of the book
  date_published?: string; // Date the book was published
  edition?: string; // Edition of the book
  pages?: number; // Number of pages
  dimensions?: string; // Dimensions in text format
  dimensions_structured?: DimensionsStructured; // Structured dimensions
  overview?: string; // Overview of the book
  image?: string; // URL to the book's cover image
  msrp?: number; // Manufacturer's suggested retail price (MSRP)
  excerpt?: string; // Excerpt from the book
  synopsis?: string; // Synopsis of the book
  authors: string[]; // List of authors
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
}: GetBookFromISBNdbOptions): Promise<GetBookFromISBNdbResponse> => {
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
  return data;
};
