import crypto from "crypto";
import type { SelectBookSchema } from "@sovoli/db/schema";
import { openai } from "@ai-sdk/openai";
import { cosineDistance, db, desc, eq, gt, inArray, sql } from "@sovoli/db";
import {
  bookEmbeddings,
  bookSearchEmbeddingsCache,
  books as booksTable,
} from "@sovoli/db/schema";
import { embedMany } from "ai";

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

/**
 * Search for books by title, author, isbn, and query
 * @param options
 * @returns
 */
export async function searchBooks(
  options: SearchBooksOptions,
): Promise<SearchBooksQueryResult[]> {
  // separate the queries into the ones that uses ISBN and the ones that use the query
  const { queryQueries } = options.queries.reduce<{
    isbnQueries: SearchBooksQuery[];
    queryQueries: Record<string, string>;
  }>(
    (acc, query) => {
      if (query.isbn) {
        acc.isbnQueries.push(query);
      } else if (query.query) {
        // add context to the query
        const templatedQuery = `Book title and possible author: ${query.query}`;
        const hash = cleanupAndHashQuery(templatedQuery);
        acc.queryQueries[hash] = templatedQuery;
      }

      return acc;
    },
    { isbnQueries: [], queryQueries: {} },
  );

  // TODO: figure out parallelization
  const queriesResults = await searchEmbeddings(queryQueries);

  // TODO: any missing books should be added to the db

  return queriesResults;
}

async function searchEmbeddings(
  queries: Record<string, string>,
): Promise<SearchBooksQueryResult[]> {
  // Extract the keys (hashes) from the queries object
  const queryHashes = Object.keys(queries);

  // check if the query is in the cache
  const cachedEmbeddings = await getCachedEmbeddings(queryHashes);

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
  const queriesToUpdate = queryHashes.reduce<Record<string, string>>(
    (acc, hash) => {
      const query = queries[hash];
      if (!cachedEmbeddings[hash] && query) {
        acc[hash] = query;
      }
      return acc;
    },
    {},
  );

  // Extract just the values (queries) that need to be updated
  const queriesToSend = Object.values(queriesToUpdate);
  // if there are queries to update, update the cache
  if (queriesToSend.length > 0) {
    let embeddings: number[][];

    try {
      embeddings = await getOpenAIEmbeddings(queriesToSend);
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

  const result: SearchBooksQueryResult[] = [];
  for (const [hash, embedding] of Object.entries(finalEmbeddings)) {
    // Ensure that the embedding is defined
    const booksWithSimilarity = await getBooksByEmbeddings(embedding);
    result.push({
      books: booksWithSimilarity,
      query: { query: queries[hash] },
    });
  }

  return result;
}

function cleanupAndHashQuery(query: string): string {
  // Remove all non-alphanumeric characters and convert to lowercase
  const cleaned = query.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

  // Create a SHA-256 hash of the cleaned string
  const hash = crypto.createHash("sha256").update(cleaned).digest("hex");

  // Return the resulting hash
  return hash;
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
