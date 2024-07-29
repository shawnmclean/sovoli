import { books } from "@sovoli/services";
import { db, schema, sql } from "@sovoli/db";

const validateInferredBook = async (book: schema.InsertInferredBook) => {
  let matchedBooks: books.GoogleBook[] = [];

  // Check with title, author, and ISBN.
  if (book.title && book.author && book.isbn) {
    matchedBooks = await books.getBooks(book.title, book.author, book.isbn);
  }

  // If not found, check with title and author.
  if (matchedBooks.length === 0 && book.title && book.author) {
    matchedBooks = await books.getBooks(book.title, book.author, null);
  }

  // If still not found, check with title only.
  if (matchedBooks.length === 0 && book.title) {
    matchedBooks = await books.getBooks(book.title, null, null);
  }

  // If no books found in any of the above checks, throw an error.
  if (matchedBooks[0] === undefined) {
    throw new Error(`Book not found: ${book.title}`);
  }

  // Return the first matched book.
  return matchedBooks[0];
};

export const handleInferredBook = async (
  inferredBook: schema.InsertInferredBook
) => {
  const validatedBook = await validateInferredBook(inferredBook);

  const isbn = validatedBook.isbn13 ?? validatedBook.isbn10;
  if (!isbn) throw new Error("No ISBN was returned");

  const upsertedBook = await db
    .insert(schema.books)
    .values({
      title: validatedBook.title,
      subtitle: validatedBook.subtitle,
      publishedDate: validatedBook.publishedDate.toDateString(),
      publisher: validatedBook.publisher,
      pageCount: validatedBook.pageCount,
      description: validatedBook.description,
      isbn: isbn,
      language: validatedBook.language,
    })
    .onConflictDoUpdate({
      target: schema.books.isbn,
      set: {
        title: sql.raw(`excluded.${schema.books.title.name}`),
        subtitle: sql.raw(`excluded.${schema.books.subtitle.name}`),
        publishedDate: sql.raw(`excluded.${schema.books.publishedDate.name}`),
        publisher: sql.raw(`excluded.${schema.books.publisher.name}`),
        pageCount: sql.raw(`excluded.${schema.books.pageCount.name}`),
        description: sql.raw(`excluded.${schema.books.description.name}`),
        language: sql.raw(`excluded.${schema.books.language.name}`),
      },
    })
    .returning();

  if (!upsertedBook[0]) throw new Error("Upserted book not returned");

  return upsertedBook[0];
};
