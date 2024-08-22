import { randomUUID } from "crypto";
import type {
  BookCover,
  InsertBookSchema,
  SelectBookSchema,
} from "@sovoli/db/schema";
import { db, sql } from "@sovoli/db";
import { BookCoverSchema, books as booksSchema } from "@sovoli/db/schema";

import { hydrateBook } from "../../trigger";

export async function insertBooks(
  books: InsertBookSchema[],
): Promise<SelectBookSchema[]> {
  const cleanedBooks = books.map((book) => {
    let cover: BookCover | null = null;

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
  });

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

function generateSlug(book: InsertBookSchema, maxLength = 70): string {
  const sanitizeString = (str: string): string => {
    return str
      .toLowerCase() // Convert to lowercase
      .trim() // Trim leading and trailing whitespace
      .replace(/[^\w\s-]/g, "") // Remove special characters except for spaces and hyphens
      .replace(/\s+/g, "-"); // Replace spaces with hyphens
  };

  const title = book.title ? sanitizeString(book.title) : "";
  const author = book.inferredAuthor ? sanitizeString(book.inferredAuthor) : "";

  // Ensure uniqueId is always defined, using ISBN if available, or a fallback UUID
  const isbn = book.isbn13 ?? book.isbn10;
  const uniqueId = isbn
    ? isbn.slice(-5)
    : (randomUUID().split("-")[0] ?? randomUUID());

  // Calculate the available length for the title
  const maxTitleLength = maxLength - (author.length + uniqueId.length + 2); // 2 for the hyphens

  // Truncate the title if it exceeds the maximum allowed length
  const shortenedTitle =
    title.length > maxTitleLength
      ? title.substring(0, maxTitleLength).trim().replace(/-+$/, "")
      : title;

  // Combine the shortened title, author, and unique identifier into the final slug
  const slug = `${shortenedTitle}-${author}-${uniqueId}`;

  return slug;
}
