import type { InsertBook } from "@sovoli/db/schema";

import type { Book } from "./models";
import { env } from "../../env";
import { AsyncResilience } from "../../utils/retry/AsyncResilience";
import { retryAsync } from "../../utils/retry/retry-async";
import { transformISBNdbToInsertBook } from "./transformISBNdbToBook";

// Response object structure for getBooksByQuery or getBooksByISBN
export interface SearchBooksFromISBNdbResponse {
  books: Book[]; // Array of Book objects from the given query or ISBN search
}

export interface SearchtBooksFromISBNdbOptions {
  query: string;
  page?: number;
  pageSize?: number;
}

export const searchBooksFromISBNdb = async ({
  query,
  page = 1,
  // max size is 1000 (their default is 20)
  pageSize = 1000,
}: SearchtBooksFromISBNdbOptions): Promise<InsertBook[]> => {
  const apiKey = env.ISBN_DB_API_KEY;
  const url = `https://api2.isbndb.com/books/${encodeURIComponent(query)}?page=${page}&pageSize=${pageSize}`;

  const fetchBooksFunc = async () => {
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
    fetchBooksFunc,
    AsyncResilience.exponentialBackoffWithJitter(),
  );

  if (!response.ok) {
    console.error(response);
    throw new Error("Failed to fetch book data");
  }

  const data = (await response.json()) as SearchBooksFromISBNdbResponse;

  // Transform each book into the InsertBook schema
  return data.books.map(transformISBNdbToInsertBook);
};
