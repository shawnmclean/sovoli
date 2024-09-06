import { randomUUID } from "crypto";
import type {
  BookCover,
  InsertBookSchema,
  SelectBookSchema,
} from "@sovoli/db/schema";
import type { bookService } from "@sovoli/services";
import { db, sql } from "@sovoli/db";
import { BookCoverSchema, books as booksSchema } from "@sovoli/db/schema";

import { hydrateBook } from "../../trigger";

function cleanBook(book: InsertBookSchema) {
  let cover: BookCover | null = null;

  //if there is an id, delete it, because we are going to use the other composite keys
  delete book.id;

  // Parse and validate the cover if it exists
  if (book.cover) {
    try {
      const parsedCover =
        typeof book.cover === "string"
          ? (JSON.parse(book.cover) as unknown)
          : book.cover;

      // Ensure parsedCover matches BookCover schema
      cover = BookCoverSchema.parse(parsedCover);
    } catch (error) {
      console.error(
        `Invalid cover format for book "${book.title || "unknown"}":`,
        error,
      );
    }
  }
  // Return the book object with either an existing slug or a generated one
  return {
    ...book,
    slug: book.slug ?? generateSlug(book),
    cover: cover,
  };
}
// TODO: update this to accept google books and do the mapping here.
export async function upsertBooksFromGoogle(
  googleBooks: bookService.googlebooks.GoogleBook[],
): Promise<SelectBookSchema[]> {
  const books: InsertBookSchema[] = googleBooks.map((googleBook) => ({
    isbn13: googleBook.isbn13 ?? null,
    isbn10: googleBook.isbn10 ?? null,
    asin: null, // Assuming Google Books doesn't provide ASIN
    olid: null, // Assuming Google Books doesn't provide OLID
    title: googleBook.title,
    subtitle: googleBook.subtitle ?? null,
    publishedDate: googleBook.publishedDate?.toISOString(),
    publisher: googleBook.publisher,
    pageCount: googleBook.pageCount,
    description: googleBook.description,
    language: googleBook.language,
    lastGoogleUpdated: new Date().toISOString(),
    inferredAuthor: Array.isArray(googleBook.authors)
      ? googleBook.authors.join(", ")
      : googleBook.authors,
    cover: {
      small: googleBook.thumbnail ?? null,
      medium: googleBook.thumbnail ?? null,
      large: googleBook.thumbnail ?? null,
    },
    slug: null, // Let the insertion function generate this if necessary
  }));

  const cleanedBooks = books.map(cleanBook);

  try {
    const insertedBooks = await db
      .insert(booksSchema)
      .values(cleanedBooks)
      .onConflictDoUpdate({
        target: [booksSchema.googleId, booksSchema.isbn10, booksSchema.isbn13],
        set: {
          title: sql.raw(`excluded.${booksSchema.title.name}`),
          subtitle: sql.raw(`excluded.${booksSchema.subtitle.name}`),
          publishedDate: sql.raw(`excluded.${booksSchema.publishedDate.name}`),
          publisher: sql.raw(`excluded.${booksSchema.publisher.name}`),
          pageCount: sql.raw(`excluded.${booksSchema.pageCount.name}`),
          description: sql.raw(`excluded.${booksSchema.description.name}`),
          language: sql.raw(`excluded.${booksSchema.language.name}`),
          cover: sql.raw(`excluded.${booksSchema.cover.name}`),
          updatedAt: sql`now()`,
          triggerDevId: sql.raw(`excluded.${booksSchema.triggerDevId.name}`),
          inferrenceError: sql.raw(
            `excluded.${booksSchema.inferrenceError.name}`,
          ),
          lastGoogleUpdated: sql.raw(
            `excluded.${booksSchema.lastGoogleUpdated.name}`,
          ),
          lastOLUpdated: sql.raw(`excluded.${booksSchema.lastOLUpdated.name}`),
          inferredAuthor: sql.raw(
            `excluded.${booksSchema.inferredAuthor.name}`,
          ),
        },
      })
      .returning();

    await hydrateBook.batchTrigger(
      insertedBooks.map((book) => ({ payload: { bookId: book.id } })),
    );
    return insertedBooks;
  } catch (error) {
    console.error("Error upserting books from google");
    throw error;
  }
}

export async function insertBooks(
  books: InsertBookSchema[],
): Promise<SelectBookSchema[]> {
  if (books.length === 0) return [];

  const cleanedBooks = books.map((book) => cleanBook(book));

  try {
    const insertedBooks = await db
      .insert(booksSchema)
      .values(cleanedBooks)
      .onConflictDoUpdate({
        target: [
          booksSchema.isbn13,
          booksSchema.isbn10,
          booksSchema.asin,
          booksSchema.slug,
          booksSchema.olid,
        ],
        set: {
          title: sql.raw(`excluded.${booksSchema.title.name}`),
          subtitle: sql.raw(`excluded.${booksSchema.subtitle.name}`),
          publishedDate: sql.raw(`excluded.${booksSchema.publishedDate.name}`),
          publisher: sql.raw(`excluded.${booksSchema.publisher.name}`),
          pageCount: sql.raw(`excluded.${booksSchema.pageCount.name}`),
          description: sql.raw(`excluded.${booksSchema.description.name}`),
          language: sql.raw(`excluded.${booksSchema.language.name}`),
          cover: sql.raw(`excluded.${booksSchema.cover.name}`),
          updatedAt: sql`now()`,
          triggerDevId: sql.raw(`excluded.${booksSchema.triggerDevId.name}`),
          inferrenceError: sql.raw(
            `excluded.${booksSchema.inferrenceError.name}`,
          ),
          lastGoogleUpdated: sql.raw(
            `excluded.${booksSchema.lastGoogleUpdated.name}`,
          ),
          lastOLUpdated: sql.raw(`excluded.${booksSchema.lastOLUpdated.name}`),
          inferredAuthor: sql.raw(
            `excluded.${booksSchema.inferredAuthor.name}`,
          ),
        },
      })
      .returning();
    await hydrateBook.batchTrigger(
      insertedBooks.map((book) => ({ payload: { bookId: book.id } })),
    );
    return insertedBooks;
  } catch (conflictError) {
    console.error("Conflict error");
    throw conflictError;
  }
}

function generateSlug(book: InsertBookSchema): string {
  const sanitizeString = (str: string): string => {
    return str
      .toLowerCase() // Convert to lowercase
      .trim() // Trim leading and trailing whitespace
      .replace(/[^\w\s-]/g, "") // Remove special characters except for spaces and hyphens
      .replace(/\s+/g, "-"); // Replace spaces with hyphens
  };

  const title = sanitizeString(book.title);

  // Ensure uniqueId is always defined, using ISBN if available, or a fallback UUID
  const isbn = book.isbn13 ?? book.isbn10;
  const uniqueId = isbn ?? randomUUID().replace(/-/g, "");

  // Calculate maximum allowed title length, leaving space for unique ID and hyphen
  const maxTitleLength = 255 - (uniqueId.length + 1); // +1 for the hyphen
  const truncatedTitle =
    title.length > maxTitleLength ? title.slice(0, maxTitleLength) : title;

  // Combine title and unique ID to form the slug
  const slug = `${truncatedTitle}-${uniqueId}`;

  return slug;
}
