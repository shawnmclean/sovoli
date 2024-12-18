import type { InsertBook } from "@sovoli/db/schema";

import type { ISBNdbBook } from "./models";
import { env } from "~/env";
import { AsyncResilience } from "~/utils/retry/AsyncResilience";
import { retryAsync } from "~/utils/retry/retry-async";
import { BaseService } from "../baseService";
import { transformISBNdbToInsertBook } from "./transformISBNdbToBook";

export interface GetBookFromISBNdbResult {
  book: InsertBook | null;
}

export interface GetBookFromISBNdbOptions {
  isbn: string;
}

export class GetBookFromISBNdb extends BaseService<
  GetBookFromISBNdbOptions,
  GetBookFromISBNdbResult
> {
  constructor() {
    super("GetBookFromISBNdb");
  }
  protected async execute({ isbn }: GetBookFromISBNdbOptions) {
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
      this.logger.error("Failed to fetch book data");
      return {
        book: null,
      };
    }

    const data = (await response.json()) as {
      book: ISBNdbBook;
    };
    const book = transformISBNdbToInsertBook(data.book);

    return {
      book,
    };
  }
}
