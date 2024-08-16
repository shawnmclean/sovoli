import { db, eq, schema } from "@sovoli/db";

import type { MatchedBook } from "../books";
import { searchBooks } from "../books";
import { UserNotFoundError } from "../errors";

export interface PutMyBooksOptions {
  username: string;
  books: {
    query?: string;
    isbn?: string;
    shelfId?: number;
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

  // search for the books
  const bookMatches = await searchBooks({
    queries: options.books.map((book) => ({
      query: book.query,
      isbn: book.isbn,
    })),
  });

  // for each book, get the best match and link the book to the user by updating the myBooks table.
  const books = bookMatches
    .map((bookMatch) => getBestMatch(bookMatch.books))
    .filter((bestMatch) => bestMatch !== undefined);

  books.map((book) => console.log({ book }));

  return user.myBooks;
}

function getBestMatch(books: MatchedBook[]): MatchedBook | undefined {
  if (books.length === 0) return undefined;

  // pick the highest similarity book, if no similarity, get the first book
  return books.reduce((bestMatch, currentBook) => {
    const bestSimilarity = bestMatch?.similarity ?? 0;
    const currentSimilarity = currentBook.similarity ?? 0;

    return currentSimilarity > bestSimilarity ? currentBook : bestMatch;
  }, books[0]);
}
