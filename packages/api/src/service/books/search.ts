import type { InsertBookSchema, SelectBookSchema } from "@sovoli/db/schema";
import { bookService } from "@sovoli/services";

import { getBooksByEmbeddings } from "./bookEmbeddings";
// import { getBooksByIsbns } from "./find";
import { insertBooks } from "./insert";
import { getSearchEmbeddings } from "./searchEmbeddings";

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

export interface SearchBooksOptions {
  queries: SearchBooksQuery[];
}

export interface SearchBooksByQueryOptions {
  query: string;
  page: number;
  pageSize: number;
}

export async function searchBooksByQuery(
  query: SearchBooksByQueryOptions,
): Promise<SearchBooksQueryResult> {
  // search internally first
  const internalResults = await searchInternalByQueries([query]);
  if (
    internalResults.length > 0 &&
    internalResults[0] &&
    internalResults[0].books.length > 0
  ) {
    return internalResults[0];
  }

  console.log(">>> no internalresults found for query", query);
  const externalResults = await searchExternallyAndPopulate([query]);
  if (
    externalResults.length > 0 &&
    externalResults[0] &&
    externalResults[0].books.length > 0
  ) {
    return externalResults[0];
  }

  console.log(">>> no results found for query", query);

  return { query, books: [], total: 0 };
}

async function searchInternalByQueries(
  queries: SearchBooksByQueryOptions[],
): Promise<SearchBooksQueryResult[]> {
  // get the search embeddings for the queries
  const searchEmbeddings = await getSearchEmbeddings(
    queries.map((q) => q.query),
  );

  console.time("Books Search Time");
  const result: SearchBooksQueryResult[] = await Promise.all(
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

/**
 * Search for books by title, author, isbn, and query
 * @param options
 * @returns
 */
export async function searchBooks(
  options: SearchBooksOptions,
): Promise<SearchBooksQueryResult[]> {
  console.time("Total Search Time");
  // separate the queries into the ones that uses ISBN and the ones that use the query
  const isbnQueries: string[] = [];
  const textQueries: SearchBooksByQueryOptions[] = [];
  options.queries.forEach((query) => {
    if (query.isbn) {
      isbnQueries.push(query.isbn);
    } else if (query.query) {
      textQueries.push({
        query: query.query,
        page: 1,
        pageSize: 10,
      });
    }
  });

  // console.log(">>> textQueries", textQueries);
  // console.log(">>> isbnQueries", isbnQueries);

  console.time("Db Search Time");
  const [isbnResults, textResults] = await Promise.all([
    // searchByISBN(isbnQueries),
    [],
    searchInternalByQueries(textQueries),
  ]);

  console.timeEnd("Db Search Time");

  const combinedDbResults = [...isbnResults, ...textResults];

  // Identify queries that have no matching books
  const unmatchedQueries = combinedDbResults
    .filter((result) => result.books.length === 0)
    .map((result) => result.query);

  // If there are unmatched queries, create the books in the database, get the ids, fire off trigger.dev to hydrate.
  // since this operation can take a while
  let externalResults: SearchBooksQueryResult[] = [];
  if (unmatchedQueries.length > 0) {
    try {
      console.time("External Search Time");
      externalResults = await searchExternallyAndPopulate(unmatchedQueries);
      console.timeEnd("External Search Time");
    } catch (error) {
      console.error(error);
    }
  }

  // Combine the db results and external results
  const finalResults = [
    ...combinedDbResults.filter((result) => result.books.length > 0),
    ...externalResults,
  ];

  console.timeEnd("Total Search Time");
  return finalResults;
}

export async function searchExternallyAndPopulate(
  queries: SearchBooksQuery[],
): Promise<SearchBooksQueryResult[]> {
  console.time("Search Externally Time");
  // 1. Perform external search and keep track of results
  const queryToBooksMap = new Map<SearchBooksQuery, InsertBookSchema[]>();

  await Promise.all(
    queries.map(async (query) => {
      const googleBooks =
        await bookService.googlebooks.searchGoogleBooks(query);

      // Convert GoogleBooks to InsertBookSchema format
      const booksToInsert: InsertBookSchema[] = googleBooks.map(
        (googleBook) => ({
          isbn13: googleBook.isbn13 ?? null,
          isbn10: googleBook.isbn10 ?? null,
          asin: null, // Assuming Google Books doesn't provide ASIN
          olid: null, // Assuming Google Books doesn't provide OLID
          title: googleBook.title,
          subtitle: googleBook.subtitle ?? null,
          publishedDate: googleBook.publishedDate?.toISOString(),
          publisher: googleBook.publisher,
          pageCount: googleBook.pageCount,
          description: googleBook.description,
          language: googleBook.language,
          lastGoogleUpdated: new Date().toISOString(),
          inferredAuthor: Array.isArray(googleBook.authors)
            ? googleBook.authors.join(", ")
            : googleBook.authors,
          cover: {
            small: googleBook.thumbnail ?? null,
            medium: googleBook.thumbnail ?? null,
            large: googleBook.thumbnail ?? null,
          },
          slug: null, // Let the insertion function generate this if necessary
        }),
      );

      // Store the mapping from query to books
      queryToBooksMap.set(query, booksToInsert);
    }),
  );
  console.timeEnd("Search Externally Time");

  // 2. Insert the books into the database
  console.time("Insert Books Time");
  const allBooksToInsert = Array.from(queryToBooksMap.values()).flat();
  // TODO: this may have to be done as a background job
  const insertedBooks = await insertBooks(allBooksToInsert);
  console.timeEnd("Insert Books Time");

  // 3. Map the inserted books back to their queries
  const searchResults: SearchBooksQueryResult[] = Array.from(
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

// async function searchByISBN(
//   isbns: string[],
// ): Promise<SearchBooksQueryResult[]> {
//   const books = await getBooksByIsbns(isbns);
//   // Create a map to group books by their ISBN
//   const booksByIsbn = isbns.reduce<Record<string, MatchedBook[]>>(
//     (acc, isbn) => {
//       const matchedBooks = books
//         .filter((book) => book.isbn10 === isbn || book.isbn13 === isbn)
//         .map((book) => ({
//           book,
//           similarity: 1,
//         }));

//       acc[isbn] = matchedBooks;
//       return acc;
//     },
//     {},
//   );

//   const results = isbns.map((isbn) => ({
//     query: { isbn },
//     books: booksByIsbn[isbn] ?? [], // Default to an empty array if no books matched
//     total: 0,
//   }));

//   return results;
// }
