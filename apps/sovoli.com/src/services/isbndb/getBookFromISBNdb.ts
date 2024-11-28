import type { InsertBook } from "@sovoli/db/schema";

import type { Book } from "./models";
import { env } from "~/env";
import { AsyncResilience } from "~/utils/retry/AsyncResilience";
import { retryAsync } from "~/utils/retry/retry-async";
import { transformISBNdbToInsertBook } from "./transformISBNdbToBook";

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
  return transformISBNdbToInsertBook(data.book);
};
