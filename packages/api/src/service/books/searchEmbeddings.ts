import crypto from "crypto";
import { openai } from "@ai-sdk/openai";
import { db, inArray, sql } from "@sovoli/db";
import { bookSearchEmbeddingsCache } from "@sovoli/db/schema";
import { embedMany } from "ai";

interface SearchQuery {
  query: string;
  templatedQuery: string;
}
/**
 * A hash map of templated query hashes to search queries
 */
type QueryHashes = Record<string, SearchQuery>;

/**
 * This will get the search embeddings for the given queries, if it cannot find them in the cache, it will
 * generate them from openAI and store them in the cache.
 * @param queries
 * @returns will return the embeddings in the same order as the queries
 */
export async function getSearchEmbeddings(
  queries: string[],
): Promise<number[][]> {
  const queryHashes = getQueryHashes(queries);

  // Get cached embeddings
  const cachedEmbeddings = await getCachedEmbeddings(Object.keys(queryHashes));

  console.log(">>> embeddings cache hit for", Object.keys(cachedEmbeddings));

  // Identify and collect the SearchQuery records that need new embeddings
  const missingSearchQueries: QueryHashes = Object.keys(queryHashes).reduce(
    (acc, hash) => {
      if (!cachedEmbeddings[hash] && queryHashes[hash]) {
        acc[hash] = queryHashes[hash];
      }
      return acc;
    },
    {} as QueryHashes,
  );

  if (Object.keys(missingSearchQueries).length > 0) {
    console.log(
      ">>> embeddings cache missed for",
      Object.keys(missingSearchQueries),
    );
    // Generate new embeddings for missing queries
    // will return the emebeddings following the same order as the missingSearchQueries
    const newEmbeddings = await getOpenAIEmbeddings(
      Object.values(missingSearchQueries).map(
        (searchQuery) => searchQuery.templatedQuery,
      ),
    );

    // Cache the new embeddings
    const cachedToUpdate = Object.keys(missingSearchQueries).map(
      (hash, index) => ({
        id: hash,
        openAIEmbedding: newEmbeddings[index] ?? [], // highly unlikely to be undefined, so pleasing the compiler
      }),
    );

    // Cache the new embeddings
    await setCachedEmbedding(cachedToUpdate);

    // Update cachedEmbeddings with new embeddings
    Object.keys(missingSearchQueries).forEach((hash, index) => {
      cachedEmbeddings[hash] = newEmbeddings[index] ?? [];
    });
  }

  // Return the embeddings in the same order as the original queries
  return Object.keys(queryHashes).map((hash) => {
    return cachedEmbeddings[hash] ?? [];
  });
}
/**
 * Generates hashes for the given queries and returns them as a QueryHashes object.
 * @param queries - The list of queries.
 * @returns A map of query hashes to SearchQuery objects.
 */
function getQueryHashes(queries: string[]): QueryHashes {
  return queries.reduce<QueryHashes>((acc, query) => {
    const { hash: queryHash, templatedQuery } = templateAndHashQuery(query);

    acc[queryHash] = {
      templatedQuery,
      query,
    };

    return acc;
  }, {});
}
/**
 * Adds context to the query, cleans up and standardizes the string, then hashes it.
 * @param query - The original search query.
 * @returns An object containing the hash and the templated query.
 */
function templateAndHashQuery(query: string): {
  hash: string;
  templatedQuery: string;
} {
  const cleanedQuery = query.toLowerCase().trim();
  const templatedQuery = `Book title and possible author: ${cleanedQuery}`;
  const hash = crypto.createHash("sha256").update(templatedQuery).digest("hex");

  return { hash, templatedQuery };
}

type EmbeddingResult = Record<string, number[] | undefined>;

/**
 * Retrieves cached embeddings for the given hashes, ensuring the same order as the hashes.
 * @param hashedQueries - The list of hashed queries.
 * @returns A map of hashed queries to their corresponding embeddings.
 */
async function getCachedEmbeddings(
  hashedQueries: string[],
): Promise<EmbeddingResult> {
  const rows = await db
    .select({
      id: bookSearchEmbeddingsCache.id,
      openAIEmbedding: bookSearchEmbeddingsCache.openAIEmbedding,
    })
    .from(bookSearchEmbeddingsCache)
    .where(inArray(bookSearchEmbeddingsCache.id, hashedQueries));

  // Convert the rows into a map of hash to embedding
  const embeddings: EmbeddingResult = rows.reduce<EmbeddingResult>(
    (acc, row) => {
      acc[row.id] = row.openAIEmbedding;
      return acc;
    },
    {},
  );

  // Ensure all requested queries have an entry, with undefined for missing ones
  hashedQueries.forEach((hash) => {
    if (!(hash in embeddings)) {
      embeddings[hash] = undefined;
    }
  });

  return embeddings;
}
/**
 * Stores the generated embeddings in the cache.
 * @param data - The list of embeddings to cache.
 */
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
/**
 * Generates embeddings using OpenAI for the given templated queries.
 * @param queries - The list of templated queries.
 * @returns A list of generated embeddings.
 */
async function getOpenAIEmbeddings(queries: string[]): Promise<number[][]> {
  const { embeddings } = await embedMany({
    model: openai.embedding("text-embedding-3-small"),
    values: queries,
  });

  return embeddings;
}
