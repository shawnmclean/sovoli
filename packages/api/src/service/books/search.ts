import type { SelectBookSchema } from "@sovoli/db/schema";
import { openai } from "@ai-sdk/openai";
import { db, inArray, sql } from "@sovoli/db";
import { embeddingsCache } from "@sovoli/db/schema";
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
  // separate the queries into the ones that uses ISBN and the ones that use the query
  const { queryQueries } = options.queries.reduce<{
    isbnQueries: SearchBooksQuery[];
    queryQueries: SearchBooksQuery[];
  }>(
    (acc, query) => {
      if (query.isbn) {
        acc.isbnQueries.push(query);
      } else if (query.query) {
        acc.queryQueries.push(query);
      }

      return acc;
    },
    { isbnQueries: [], queryQueries: [] },
  );

  // TODO: figure out parallelization
  const queries = queryQueries.map((query) => query.query ?? "");
  const queriesResults = await searchEmbeddings(queries);

  console.log(">>> searchBooks", { queriesResults });

  // TODO: any missing books should be added to the db

  return [];
}

async function searchEmbeddings(
  queries: string[],
): Promise<SelectBookSchema[]> {
  // check if the query is in the cache
  const cachedEmbeddings = await getCachedEmbeddings(queries);

  // get queries that need to be updated
  const queriesToUpdate = queries.filter((query) => !cachedEmbeddings[query]);

  // if there are queries to update, update the cache
  if (queriesToUpdate.length > 0) {
    let embeddings: number[][];
    try {
      embeddings = await getOpenAIEmbeddings(queriesToUpdate);
      const embedData = embeddings.map((embedding, index) => ({
        // ensure the text never is undefined in the event openAI returns more embeddings than queries
        text: queriesToUpdate[index] ?? `unknown-${index}`,
        embedding,
      }));

      await setCachedEmbedding(embedData);
    } catch (error) {
      console.error(error);
    }
  }

  // TODO query the db with the embeddings for the books
  return [];
}

async function getCachedEmbeddings(queries: string[]) {
  const rows = await db
    .select({
      text: embeddingsCache.text,
      openAIEmbedding: embeddingsCache.openAIEmbedding,
    })
    .from(embeddingsCache)

    .where(inArray(embeddingsCache.text, queries));

  const embeddings: Record<string, number[] | null> = {};
  queries.forEach((query) => (embeddings[query] = null));

  rows.forEach((row) => {
    embeddings[row.text] = row.openAIEmbedding;
  });

  return embeddings;
}

async function setCachedEmbedding(
  data: { text: string; embedding: number[] }[],
) {
  const insertData = data.map((d) => ({
    text: d.text,
    openAIEmbedding: d.embedding,
  }));

  await db
    .insert(embeddingsCache)
    .values(insertData)
    .onConflictDoUpdate({
      target: embeddingsCache.text,
      set: {
        openAIEmbedding: sql.raw(
          `excluded.${embeddingsCache.openAIEmbedding.name}`,
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
