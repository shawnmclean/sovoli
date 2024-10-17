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
  forceExternal?: boolean;
}

export const searchBooksByQuery = async ({
  query,
  page = 1,
  pageSize = 20,
  forceExternal = false,
}: SearchBooksByQueryOptions): Promise<SearchBooksByQueryResult> => {
  const internalBooks = await db.query.Book.findMany({
    where: sql`${schema.Book.search} @@ websearch_to_tsquery('english', ${query})`,
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });

  // TODO: later we can combine the internal and external search calls under a single promise.all
  if (internalBooks.length > 0 && !forceExternal) {
    console.log(`found ${internalBooks.length} books in internal db`);
    return {
      books: internalBooks,
    };
  }

  console.log("no internal results, searching externally");

  const externalBooks = await searchBooksFromISBNdb({
    query,
  });

  console.log(`books found from external: ${externalBooks.length}`);

  const upsertedBooks = await upsertBooks(externalBooks);

  console.log(`books upserted: ${upsertedBooks.length}`);

  const mergedBooks = Array.from(
    new Map(
      [...internalBooks, ...upsertedBooks].map((book) => [book.id, book]), // Use id as the unique key
    ).values(), // Get unique books by id
  );

  return {
    books: mergedBooks,
  };
};
