import { SelectBookSchema } from "@sovoli/db/schema";

export interface SearchBooksQuery {
  isbn?: string;
  /**
   * this can be a semantic search query that will use the embeddings to search for books
   */
  query?: string;
}

export interface SearchBooksQueryResult {
  /**
   * the query that was used to search for the book
   */
  query: SearchBooksQuery;
  total: number;
  /**
   * books matching the query
   */
  books: MatchedBook[];
}

export interface MatchedBook {
  book: SelectBookSchema;
  similarity?: number;
}

export interface SearchBooksOptions {
  queries: SearchBooksQuery[];
}

/**
 * Search for books by title, author, isbn, and query
 * @param options
 * @returns
 */
export async function searchBooks(
  options: SearchBooksOptions,
): Promise<SearchBooksQueryResult[]> {
  return [];
}

function searchEmbeddings(query: string): Promise<SelectBookSchema[]> {
  // check if the query is in the cache

  return [];
}

function getCachedEmbedding(query: string): Promise<number[] | undefined> {
  // get embeddings from cache
  console.log(">>> getCachedEmbedding", { query });
  return undefined;
}

function getOpenAIEmbedding(query: string): Promise<number[]> {
  console.log(">>> getOpenAIEmbedding", { query });
  return [];
}
