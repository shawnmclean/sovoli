import type { SelectBook } from "@sovoli/db/schema";

import { searchBooksFromISBNdb } from "../isbndb";
import { upsertBooks } from "./insert";

export interface SearchBooksByQueryResult {
  /**
   * books matching the query
   */
  books: SelectBook[];

  total: number;
}
export interface SearchBooksByQueryOptions {
  query: string;
  page?: number;
  pageSize?: number;
}

export const searchBooksByQuery = async ({
  query,
  page = 1,
  pageSize = 20,
}: SearchBooksByQueryOptions): Promise<SearchBooksByQueryResult> => {
  // TODO: search internal with full text search

  console.log("no internal results, searching externally");

  const externalBooks = await searchBooksFromISBNdb({
    query,
    page,
    pageSize,
  });

  console.log(`books found from external: ${externalBooks.length}`);

  const upsertedBooks = await upsertBooks(externalBooks);

  console.log(`books upserted: ${upsertedBooks.length}`);

  return {
    books: upsertedBooks,
    total: upsertedBooks.length,
  };
};
