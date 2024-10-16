import type { SelectBookSchema } from "@sovoli/db/schema";

import { searchBooksFromISBNdb } from "../isbndb";

// import { getBooksByIsbns } from "./find";

export interface SearchBooksQuery {
  isbn?: string;
  /**
   * this can be a semantic search query that will use the embeddings to search for books
   */
  query?: string;
}

export interface SearchBooksByQueryResult {
  /**
   * books matching the query
   */
  books: SelectBookSchema[];

  total: number;
}

export interface MatchedBook {
  book: SelectBookSchema;
  similarity?: number;
}

export interface SearchBooksByQueryOptions {
  query: string;
  page?: number;
  pageSize?: number;
}

export const searchBooksByQuery = async (
  _: SearchBooksByQueryOptions,
): Promise<SearchBooksByQueryResult> => {
  const books = await searchBooksFromISBNdb(_);

  return {
    books,
    total: books.length,
  };
};
