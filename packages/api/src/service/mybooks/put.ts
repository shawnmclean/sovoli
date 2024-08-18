import type { InsertMyBookSchema, SelectMyBookSchema } from "@sovoli/db/schema";
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

  // search for the books internally
  const bookMatches = await searchBooks({
    queries: options.books.map((book) => ({
      query: book.query,
    })),
  });

  // Prepare a list to hold the myBooks insert objects
  const myBooksToInsert: InsertMyBookSchema[] = [];

  // for each book, get the best match if available
  // then create the my-book insert object using the id
  // for the queries without a match, create the my-book insert object with the query
  bookMatches.forEach((bookMatch) => {
    const bestMatch = getBestMatch(bookMatch.books);

    const baseMyBook: InsertMyBookSchema = {
      name: bestMatch?.book.title,
      ownerId: user.id,
      query: bookMatch.query.query,
      bookId: bestMatch?.book.id, // If no match, leave bookId as null
    };

    myBooksToInsert.push(baseMyBook);
  });

  const insertedMyBooks = await insertMyBooks(myBooksToInsert);

  await hydrateMyBooks.trigger({ userId: user.id });

  return insertedMyBooks;
}

async function insertMyBooks(myBooksToInsert: InsertMyBookSchema[]) {
  try {
    // Separate the rows with NULL and non-NULL bookId
    const nonNullBookIdInserts = myBooksToInsert.filter(
      (book) => book.bookId !== undefined,
    );
    const nullBookIdInserts = myBooksToInsert.filter(
      (book) => book.bookId === undefined,
    );

    let createdBooks: SelectMyBookSchema[] = [];
    // Insert rows with non-NULL bookId and handle conflicts
    if (nonNullBookIdInserts.length > 0) {
      const nonNullResults = await db
        .insert(schema.myBooks)
        .values(nonNullBookIdInserts)
        .onConflictDoUpdate({
          target: [schema.myBooks.ownerId, schema.myBooks.bookId],
          set: {
            name: sql.raw(`excluded.${schema.myBooks.name.name}`),
          },
        })
        .returning();

      createdBooks = createdBooks.concat(nonNullResults);
    }

    // Insert rows with NULL bookId without ON CONFLICT logic
    if (nullBookIdInserts.length > 0) {
      const nullResults = await db
        .insert(schema.myBooks)
        .values(nullBookIdInserts)
        .returning();

      createdBooks = createdBooks.concat(nullResults);
    }

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
  if (books.length === 0) return undefined;

  // Pick the highest similarity book; if no similarity, get the first book
  return books.reduce((bestMatch, currentBook) => {
    const bestSimilarity = bestMatch?.similarity ?? 0;
    const currentSimilarity = currentBook.similarity ?? 0;

    return currentSimilarity > bestSimilarity ? currentBook : bestMatch;
  }, books[0]);
}
