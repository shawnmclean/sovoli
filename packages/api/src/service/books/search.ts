import crypto from "crypto";
import type { InsertBookSchema, SelectBookSchema } from "@sovoli/db/schema";
import { openai } from "@ai-sdk/openai";
import { cosineDistance, db, desc, eq, gt, inArray, sql } from "@sovoli/db";
import {
  bookEmbeddings,
  bookSearchEmbeddingsCache,
  books as booksTable,
} from "@sovoli/db/schema";
import { books as booksService } from "@sovoli/services";
import { embedMany } from "ai";

import { getBooksByIsbns } from "./find";
import { insertBooks } from "./insert";

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
  books: MatchedBook[];
}

export interface MatchedBook {
  book: SelectBookSchema;
  similarity?: number;
}

export interface SearchBooksOptions {
  queries: SearchBooksQuery[];
}

interface SearchQuery {
  query: string;
  templatedQuery: string;
}
/**
 * A hash map of templated query hashes to search queries
 */
type QueryHashes = Record<string, SearchQuery>;
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
  const textQueries: string[] = [];
  options.queries.forEach((query) => {
    if (query.isbn) {
      isbnQueries.push(query.isbn);
    } else if (query.query) {
      textQueries.push(query.query);
    }
  });

  // console.log(">>> textQueries", textQueries);
  // console.log(">>> isbnQueries", isbnQueries);

  console.time("Db Search Time");
  const [isbnResults, textResults] = await Promise.all([
    searchByISBN(isbnQueries),
    searchByQuery(textQueries),
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
      const googleBooks = await booksService.searchGoogleBooks(query);
      googleBooks.forEach((book) =>
        console.log(book.title, book.publishedDate),
      );
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
  const insertedBooks = await insertBooks(allBooksToInsert);
  console.timeEnd("Insert Books Time");

  // 3. Map the inserted books back to their queries
  const searchResults: SearchBooksQueryResult[] = Array.from(
    queryToBooksMap.entries(),
  ).map(([query, originalBooksToInsert]) => {
    // Find the corresponding inserted books
    const matchedBooks: MatchedBook[] = insertedBooks
      .filter((insertedBook) =>
        originalBooksToInsert.some(
          (book) =>
            book.isbn13 === insertedBook.isbn13 ||
            book.isbn10 === insertedBook.isbn10,
        ),
      )
      .map((book) => ({ book, similarity: undefined })); // Set similarity if needed

    return {
      query,
      books: matchedBooks,
    };
  });

  return searchResults;
}

async function searchByISBN(
  isbns: string[],
): Promise<SearchBooksQueryResult[]> {
  const books = await getBooksByIsbns(isbns);
  // Create a map to group books by their ISBN
  const booksByIsbn = isbns.reduce<Record<string, MatchedBook[]>>(
    (acc, isbn) => {
      const matchedBooks = books
        .filter((book) => book.isbn10 === isbn || book.isbn13 === isbn)
        .map((book) => ({
          book,
          similarity: 1,
        }));

      acc[isbn] = matchedBooks;
      return acc;
    },
    {},
  );

  const results = isbns.map((isbn) => ({
    query: { isbn },
    books: booksByIsbn[isbn] ?? [], // Default to an empty array if no books matched
  }));

  return results;
}

async function searchByQuery(
  queries: string[],
): Promise<SearchBooksQueryResult[]> {
  const queryHashes = queries.reduce<QueryHashes>((acc, query) => {
    // Add context to the query, clean up and standardize the string
    const cleanedQuery = query.toLowerCase().trim(); // Optional: Trim leading/trailing whitespace

    const templatedQuery = `Book title and possible author: ${cleanedQuery}`;

    const hash = crypto
      .createHash("sha256")
      .update(templatedQuery)
      .digest("hex");

    // Store the original query and the templated query in the hash map
    acc[hash] = {
      templatedQuery,
      query: cleanedQuery,
    };

    return acc;
  }, {});

  return searchByEmbeddings(queryHashes);
}

async function searchByEmbeddings(
  queries: QueryHashes,
): Promise<SearchBooksQueryResult[]> {
  // Extract the keys (hashes) from the queries object
  const queryHashes = Object.keys(queries);

  console.time("Cached Embeddings Search Time");
  // check if the query is in the cache
  const cachedEmbeddings = await getCachedEmbeddings(queryHashes);
  console.timeEnd("Cached Embeddings Search Time");

  // this should have our cached embeddings and the embeddings coming from openAI
  const finalEmbeddings: Record<string, number[]> = Object.keys(
    cachedEmbeddings,
  ).reduce<Record<string, number[]>>((acc, key) => {
    const embedding = cachedEmbeddings[key];
    if (embedding !== undefined) {
      acc[key] = embedding;
    }
    return acc;
  }, {});

  // Get the queries that need to be updated (those not found in the cache)
  const queriesToUpdate = queryHashes.reduce<QueryHashes>((acc, hash) => {
    const query = queries[hash];
    if (!cachedEmbeddings[hash] && query) {
      acc[hash] = query;
    }
    return acc;
  }, {});

  // Extract just the values (queries) that need to be updated
  const queriesToSend = Object.values(queriesToUpdate);
  // if there are queries to update, update the cache
  if (queriesToSend.length > 0) {
    let embeddings: number[][];

    try {
      embeddings = await getOpenAIEmbeddings(
        queriesToSend.map((q) => q.templatedQuery),
      );
      // Construct the data to be cached, ensuring alignment between hashes and embeddings
      const embedData = Object.keys(queriesToUpdate).reduce<
        { id: string; openAIEmbedding: number[] }[]
      >((acc, hash, index) => {
        const openAIEmbedding = embeddings[index];
        if (openAIEmbedding !== undefined) {
          acc.push({ id: hash, openAIEmbedding });
          finalEmbeddings[hash] = openAIEmbedding;
        }
        return acc;
      }, []);
      // Update the cache with the new embeddings
      if (embedData.length > 0) {
        await setCachedEmbedding(embedData);
      }
    } catch (error) {
      console.error(error);
    }
  }

  console.time("Books Search Time");
  const result: SearchBooksQueryResult[] = await Promise.all(
    Object.entries(finalEmbeddings).map(async ([hash, embedding]) => {
      // Ensure that the embedding is defined
      const booksWithSimilarity = await getBooksByEmbeddings(embedding);

      return {
        books: booksWithSimilarity,
        query: { query: queries[hash]?.query },
      };
    }),
  );
  console.timeEnd("Books Search Time");

  return result;
}

async function getCachedEmbeddings(hashedQueries: string[]) {
  const rows = await db
    .select({
      id: bookSearchEmbeddingsCache.id,
      openAIEmbedding: bookSearchEmbeddingsCache.openAIEmbedding,
    })
    .from(bookSearchEmbeddingsCache)

    .where(inArray(bookSearchEmbeddingsCache.id, hashedQueries));

  // map back to the original queries, set undefined to the ones not found
  const embeddings: Record<string, number[] | undefined> = {};
  hashedQueries.forEach((hash) => (embeddings[hash] = undefined));

  rows.forEach((row) => {
    embeddings[row.id] = row.openAIEmbedding;
  });

  return embeddings;
}

async function setCachedEmbedding(
  data: { id: string; openAIEmbedding: number[] }[],
) {
  await db
    .insert(bookSearchEmbeddingsCache)
    .values(data)
    .onConflictDoUpdate({
      target: bookSearchEmbeddingsCache.id,
      set: {
        openAIEmbedding: sql.raw(
          `excluded.${bookSearchEmbeddingsCache.openAIEmbedding.name}`,
        ),
      },
    });
}

async function getOpenAIEmbeddings(queries: string[]): Promise<number[][]> {
  const { embeddings } = await embedMany({
    model: openai.embedding("text-embedding-3-small"),
    values: queries,
  });

  return embeddings;
}

async function getBooksByEmbeddings(embedding: number[]) {
  const similarity = sql<number>`1 - (${cosineDistance(bookEmbeddings.openAIEmbedding, embedding)})`;

  const books = await db
    .select({
      book: booksTable,
      similarity,
    })
    .from(bookEmbeddings)
    .innerJoin(booksTable, eq(bookEmbeddings.bookId, booksTable.id))
    .where(gt(similarity, 0.5))
    .orderBy((t) => desc(t.similarity))
    .limit(4);

  return books;
}
