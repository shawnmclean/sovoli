import type { InsertMyBookSchema } from "@sovoli/db/schema";
import { db, eq, schema, sql } from "@sovoli/db";

import type { MatchedBook } from "../books";
import { hydrateMyBooks } from "../../trigger/myBooks";
import { searchBooks } from "../books";
import { UserNotFoundError } from "../errors";

export interface PutMyBooksOptions {
  username: string;
  books: {
    query?: string;
  }[];
}

/**
 * Before this function is called, ensure the user has permission to update this user's books
 * @param options
 * @returns
 */
export async function putMyBooks(options: PutMyBooksOptions) {
  const user = await db.query.users.findFirst({
    with: {
      myBooks: {
        with: {
          book: true,
        },
      },
    },
    where: eq(schema.users.username, options.username),
  });

  if (!user) throw new UserNotFoundError(options.username);

  // Step 1: Get unique queries from the input and filter out nulls
  const uniqueQueries = Array.from(
    new Set(
      options.books
        .map((book) => book.query?.toLowerCase().trim())
        .filter((query): query is string => query !== undefined),
    ),
  );

  // Step 2: Filter out queries that the user has already searched for
  const existingBooks = user.myBooks.filter(
    (myBook) => myBook.query && uniqueQueries.includes(myBook.query),
  );

  // Step 3: Filter out queries that need to be searched by removing the queries that matches the existingBooks
  // Create a Set of existing queries for quick lookup
  const existingQueriesSet = new Set(
    existingBooks.map((book) => book.query?.toLowerCase().trim()),
  );

  // Step 4: Filter out queries that need to be searched
  const filteredQueries = uniqueQueries.filter(
    (query) => !existingQueriesSet.has(query),
  );

  if (filteredQueries.length === 0) return existingBooks;

  // Step 3: Search for books based on filtered queries
  const bookMatches = await searchBooks({
    queries: filteredQueries.map((query) => ({ query })),
  });

  // Prepare a list of myBooks insert objects
  const myBooksToInsert: InsertMyBookSchema[] = bookMatches.map((bookMatch) => {
    const bestMatch = getBestMatch(bookMatch.books);

    return {
      name: bestMatch?.book.title,
      ownerId: user.id,
      query: bookMatch.query.query,
      bookId: bestMatch?.book.id ?? null, // If no match, set bookId as null
    };
  });

  // Insert books and hydrate user's myBooks
  const insertedMyBooks = await insertMyBooks(myBooksToInsert);
  await hydrateMyBooks.trigger({ userId: user.id });

  return [...existingBooks, ...insertedMyBooks];
}

async function insertMyBooks(myBooksToInsert: InsertMyBookSchema[]) {
  try {
    const createdBooks = await db
      .insert(schema.myBooks)
      .values(myBooksToInsert)
      .onConflictDoUpdate({
        target: [schema.myBooks.ownerId, schema.myBooks.bookId],
        set: {
          name: sql.raw(`excluded.${schema.myBooks.name.name}`),
        },
      })
      .returning();

    return createdBooks;
  } catch (error) {
    console.error("Error inserting myBooks:", error);
    throw error;
  }
}

/**
 * Get the best match from a list of matched books based on similarity.
 * @param books
 * @returns MatchedBook | undefined
 */
export function getBestMatch(books: MatchedBook[]): MatchedBook | undefined {
  return books.reduce(
    (bestMatch, currentBook) =>
      (currentBook.similarity ?? 0) > (bestMatch?.similarity ?? 0)
        ? currentBook
        : bestMatch,
    books[0],
  );
}
