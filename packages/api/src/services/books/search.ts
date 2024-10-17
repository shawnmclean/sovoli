import type { SelectBook } from "@sovoli/db/schema";
import { db, schema, sql } from "@sovoli/db";

import { searchBooksFromISBNdb } from "../isbndb";
import { upsertBooks } from "./insert";

export interface SearchBooksByQueryResult {
  /**
   * books matching the query
   */
  books: SelectBook[];
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
  const internalBooks = await db.query.Book.findMany({
    where: sql`${schema.Book.search} @@ websearch_to_tsquery('english', ${query})`,
  });

  if (internalBooks.length > 0) {
    console.log(`found ${internalBooks.length} books in internal db`);
    return {
      books: internalBooks,
    };
  }

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
  };
};
