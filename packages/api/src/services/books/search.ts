import type { SelectBookSchema } from "@sovoli/db/schema";
import { db, eq, or, schema } from "@sovoli/db";

import type { GoogleBook } from "../../services/googlebooks";
import { searchGoogleBooks } from "../../services/googlebooks";
import { hydrateBook } from "../../trigger";
import { getBooksByEmbeddings } from "./bookEmbeddings";
// import { getBooksByIsbns } from "./find";
import { upsertBooksFromGoogle } from "./insert";
import { getSearchEmbeddings } from "./searchEmbeddings";

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

export const searchBooksByQuery = async ({
  query,
  page = 1,
  pageSize = 10,
}: SearchBooksByQueryOptions): Promise<SearchBooksByQueryResult> => {
  // search internally first
  const internalResults = await searchInternalByQueries([
    {
      query,
      page,
      pageSize,
    },
  ]);
  console.log("internal results", internalResults);
  if (
    internalResults.length > 0 &&
    internalResults[0] &&
    internalResults[0].books.length > 0
  ) {
    return internalResults[0];
  }

  console.log("no internal results, searching externally");

  const externalResults = await searchExternallyAndPopulate([
    {
      query,
    },
  ]);
  if (
    externalResults.length > 0 &&
    externalResults[0] &&
    externalResults[0].books.length > 0
  ) {
    return externalResults[0];
  }

  return { books: [], total: 0 };
};

async function searchInternalByQueries(
  queries: SearchBooksByQueryOptions[],
): Promise<SearchBooksByQueryResult[]> {
  console.log("searching internally disabled for now");

  return Promise.resolve(
    queries.map((q) => ({
      query: { query: q.query },
      books: [],
      total: 0,
    })),
  );

  // get the search embeddings for the queries
  const searchEmbeddings = await getSearchEmbeddings(
    queries.map((q) => q.query),
  );

  console.time("Books Search Time");
  const result: SearchBooksByQueryResult[] = await Promise.all(
    searchEmbeddings.map(async (embedding, index) => {
      if (!queries[index])
        throw new Error(
          "The searchEmbeddings array must be the same length as the queries array",
        );
      const { page, pageSize, query } = queries[index];
      // Ensure that the embedding is defined
      const { data, total } = await getBooksByEmbeddings(
        embedding,
        page,
        pageSize,
      );

      return {
        books: data,
        total: total,
        query: { query }, // Associate with the correct query
      };
    }),
  );
  console.timeEnd("Books Search Time");

  return result;
}

export async function searchExternallyAndPopulate(
  queries: SearchBooksQuery[],
): Promise<SearchBooksByQueryResult[]> {
  console.time("Search Externally Time");
  // 1. Perform external search and keep track of results
  const queryToBooksMap = new Map<SearchBooksQuery, GoogleBook[]>();

  await Promise.all(
    queries.map(async (query) => {
      const googleBooks = await searchGoogleBooks({
        ...query,
        limit: 1,
      });
      // Store the mapping from query to books
      queryToBooksMap.set(query, googleBooks);
    }),
  );
  console.timeEnd("Search Externally Time");

  // 2. Insert the books into the database
  console.time("Insert Books Time");

  const allBooksToInsert = Array.from(queryToBooksMap.values()).flat();
  const insertedBooks = await upsertBooksFromGoogle(allBooksToInsert);
  console.timeEnd("Insert Books Time");

  // This will fire off the trigger.dev task to hydrate the book
  if (insertedBooks.length > 0) {
    await hydrateBook.batchTrigger(
      insertedBooks.map((book) => ({ payload: { bookId: book.id } })),
    );
  }

  // 3. Map the inserted books back to their queries
  const searchResults: SearchBooksByQueryResult[] = Array.from(
    queryToBooksMap.entries(),
  ).map(([query, originalBooksToInsert]) => {
    // Find the corresponding inserted books
    const matchedBooks = insertedBooks.filter((insertedBook) =>
      originalBooksToInsert.some(
        (book) =>
          book.isbn13 === insertedBook.isbn13 ||
          book.isbn10 === insertedBook.isbn10,
      ),
    );

    return {
      query,
      books: matchedBooks,
      total: matchedBooks.length,
    };
  });

  return searchResults;
}

export interface SearchBooksByISBNQuery {
  isbn: string;
}

export interface FindBookByISBNResult {
  /**
   * book matching the query
   */
  book?: SelectBookSchema;
}

export const findBookByISBN = async ({
  isbn,
}: SearchBooksByISBNQuery): Promise<FindBookByISBNResult> => {
  const internalBook = await db.query.Book.findFirst({
    where: or(eq(schema.Book.isbn10, isbn), eq(schema.Book.isbn13, isbn)),
  });

  if (internalBook) {
    return {
      book: internalBook,
    };
  }

  console.log("no internal results, searching externally");

  const externalResults = await searchExternallyAndPopulate([
    {
      isbn: isbn,
    },
  ]);
  if (
    externalResults.length > 0 &&
    externalResults[0] &&
    externalResults[0].books.length > 0
  ) {
    return {
      book: externalResults[0].books[0],
    };
  }

  return {};
};
