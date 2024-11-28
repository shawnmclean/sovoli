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
  const books = await db.query.Book.findMany({
    where: sql`${schema.Book.search} @@ websearch_to_tsquery('english', ${query})`,
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });

  // TODO: later we can combine the internal and external search calls under a single promise.all
  if (books.length > 0 && !forceExternal) {
    console.log(`found ${books.length} books in internal db`);
    return {
      books: books,
    };
  }

  console.log("no internal results, searching externally");

  const externalBooks = await searchBooksFromISBNdb({
    query,
  });

  console.log(`books found from external: ${externalBooks.length}`);
  if (externalBooks.length > 0) {
    const upsertedExternalBooks = await upsertBooks(externalBooks);
    console.log(`books upserted: ${upsertedExternalBooks.length}`);
    const allBooks = [...books, ...upsertedExternalBooks];

    // Filter out duplicate books by 'id' using a Map
    const uniqueBooks = Array.from(
      new Map(allBooks.map((book) => [book.id, book])).values(),
    );

    return {
      books: uniqueBooks,
    };
  }

  console.log("no external results, returning internal results");

  return {
    books,
  };
};
