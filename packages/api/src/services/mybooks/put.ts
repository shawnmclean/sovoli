import type { SelectMyBookSchema } from "@sovoli/db/schema";
import { db, eq, schema } from "@sovoli/db";

import { hydrateMyBook } from "../../trigger/myBooks";
import { UserNotFoundError } from "../errors";

export interface PutMyBooksOptions {
  username: string;
  books: {
    query?: string;
  }[];
}

/**
 * This function will update the user's myBooks table with the given queries and fire off a background job to hydrate the books.
 * @param options
 * @returns
 */
export async function putMyBookQueries(options: PutMyBooksOptions) {
  const user = await db.query.User.findFirst({
    with: {
      myBooks: {
        with: {
          book: true,
        },
      },
    },
    where: eq(schema.User.username, options.username),
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

  let insertedBooks: SelectMyBookSchema[] = [];
  if (filteredQueries.length > 0) {
    const booksToInsert = filteredQueries.map((query) => ({
      query,
      ownerId: user.id,
    }));

    insertedBooks = await db
      .insert(schema.myBooks)
      .values(booksToInsert)
      .onConflictDoNothing()
      .returning();
  }
  const allBooks = [...insertedBooks, ...existingBooks];

  await hydrateMyBook.batchTrigger(
    allBooks.map((book) => ({ payload: { myBookId: book.id } })),
  );

  return allBooks;
}