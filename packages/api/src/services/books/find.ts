import type { SelectBookSchema } from "@sovoli/db/schema";
import { db, inArray, or } from "@sovoli/db";
import { Book } from "@sovoli/db/schema";

export interface FindBooksOptions {
  title?: string;
  author?: string;
  isbn?: string;
}

export function findBooks(
  options: FindBooksOptions,
): Promise<SelectBookSchema> {
  // title and author must exist if isbn is not provided
  if (!options.isbn && !options.title) {
    throw new Error("title must be provided if isbn is not provided");
  }
  if (options.isbn) {
    // const books = await getBooksByIsbns([options.isbn]);
  }
  if (options.title) {
    // getBookByTitle(options.title, options.author);
  }
  throw new Error("Not implemented");
}

/**
 * Get the first matching book by title and author
 * @param title
 * @param author
 */
// function getBookByTitle(title: string, author?: string) {
//   throw new Error("Not implemented");
// }

/**
 * Get the first matching book by isbn, it will check the isbn13 and isbn10 fields
 * @param isbn
 */
export async function getBooksByIsbns(isbns: string[]) {
  if (isbns.length === 0) return [];
  return await db.query.Book.findMany({
    where: or(inArray(Book.isbn13, isbns), inArray(Book.isbn10, isbns)),
  });
}
