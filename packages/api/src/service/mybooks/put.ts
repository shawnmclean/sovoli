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
      slug: bestMatch?.book.slug ?? slugify(bookMatch.query.query ?? ""),
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
    return await db
      .insert(schema.myBooks)
      .values(myBooksToInsert)
      .onConflictDoUpdate({
        target: [schema.myBooks.ownerId, schema.myBooks.slug],
        set: {
          name: sql.raw(`excluded.${schema.myBooks.name.name}`),
        },
      })
      .returning();
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
function getBestMatch(books: MatchedBook[]): MatchedBook | undefined {
  if (books.length === 0) return undefined;

  // Pick the highest similarity book; if no similarity, get the first book
  return books.reduce((bestMatch, currentBook) => {
    const bestSimilarity = bestMatch?.similarity ?? 0;
    const currentSimilarity = currentBook.similarity ?? 0;

    return currentSimilarity > bestSimilarity ? currentBook : bestMatch;
  }, books[0]);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
