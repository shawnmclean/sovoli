import type { SelectBookSchema } from "@sovoli/db/schema";

export interface FindBooksOptions {
  title?: string;
  author?: string;
  isbn?: string;
}

export async function findBooks(
  options: FindBooksOptions,
): Promise<SelectBookSchema> {
  // title and author must exist if isbn is not provided
  if (!options.isbn && (!options.title || !options.author)) {
    throw new Error(
      "title and author must be provided if isbn is not provided",
    );
  }
  throw new Error("Not implemented");
}

/**
 * Get the first matching book by title and author
 * @param title
 * @param author
 */
async function getBookByTitleAndAuthor(title: string, author?: string) {
  throw new Error("Not implemented");
}

/**
 * Get the first matching book by isbn, it will check the isbn13 and isbn10 fields
 * @param isbn
 */
async function getBookByIsbn(isbn: string) {
  throw new Error("Not implemented");
}
