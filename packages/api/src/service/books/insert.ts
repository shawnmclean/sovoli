import { randomUUID } from "crypto";
import type { SelectBookSchema } from "@sovoli/db/schema";
import type { bookService } from "@sovoli/services";
import { db, eq, getTableConfig, sql } from "@sovoli/db";
import { BookCoverSchema, books as booksSchema } from "@sovoli/db/schema";

export async function upsertBooksFromGoogle(
  googleBooks: bookService.googlebooks.GoogleBook[],
): Promise<SelectBookSchema[]> {
  if (googleBooks.length === 0) return [];

  const books = googleBooks.map((googleBook) => ({
    googleId: googleBook.id,
    isbn13: googleBook.isbn13 ?? null,
    isbn10: googleBook.isbn10 ?? null,
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
    cover: BookCoverSchema.parse({
      small: googleBook.thumbnail ?? null,
      medium: googleBook.thumbnail ?? null,
      large: googleBook.thumbnail ?? null,
    }),
    slug: generateSlug(
      googleBook.title,
      googleBook.isbn10 ?? googleBook.isbn13,
    ),
  }));

  try {
    const insertedBooks = await db
      .insert(booksSchema)
      .values(books)
      .onConflictDoUpdate({
        target: [booksSchema.googleId],
        set: {
          title: sql.raw(`excluded.${booksSchema.title.name}`),
          subtitle: sql.raw(`excluded.${booksSchema.subtitle.name}`),
          publishedDate: sql.raw(`excluded.${booksSchema.publishedDate.name}`),
          publisher: sql.raw(`excluded.${booksSchema.publisher.name}`),
          pageCount: sql.raw(`excluded.${booksSchema.pageCount.name}`),
          description: sql.raw(`excluded.${booksSchema.description.name}`),
          language: sql.raw(`excluded.${booksSchema.language.name}`),
          cover: sql.raw(
            `COALESCE(excluded.${booksSchema.cover.name}, ${getTableConfig(booksSchema).name}.${booksSchema.cover.name})`,
          ),
          slug: sql.raw(
            `COALESCE(excluded.${booksSchema.slug.name}, ${getTableConfig(booksSchema).name}.${booksSchema.slug.name})`,
          ),
          updatedAt: sql`now()`,
          lastGoogleUpdated: sql.raw(
            `excluded.${booksSchema.lastGoogleUpdated.name}`,
          ),
          inferredAuthor: sql.raw(
            `excluded.${booksSchema.inferredAuthor.name}`,
          ),
        },
      })
      .returning();

    return insertedBooks;
  } catch (error) {
    console.error("Error upserting books from google");
    throw error;
  }
}

export async function updateBookFromOpenLibrary(
  bookId: string,
  openLibraryBook: bookService.openlibrary.OpenLibraryBook,
): Promise<SelectBookSchema> {
  const updatedBook = await db
    .update(booksSchema)
    .set({
      olid: openLibraryBook.olid,
      updatedAt: new Date().toISOString(),
      lastOLUpdated: new Date().toISOString(),
      cover: BookCoverSchema.parse({
        small: openLibraryBook.cover?.small ?? null,
        medium: openLibraryBook.cover?.medium ?? null,
        large: openLibraryBook.cover?.large ?? null,
      }),
    })
    .where(eq(booksSchema.id, bookId))
    .returning();

  if (!updatedBook[0]) {
    console.error(`Book not found for bookId: ${bookId}`);
    throw new Error(`Book not found for bookId: ${bookId}`);
  }

  return updatedBook[0];
}

function generateSlug(title: string, isbn: string | null): string {
  const sanitizeString = (str: string): string => {
    return str
      .toLowerCase() // Convert to lowercase
      .trim() // Trim leading and trailing whitespace
      .replace(/[^\w\s-]/g, "") // Remove special characters except for spaces and hyphens
      .replace(/\s+/g, "-"); // Replace spaces with hyphens
  };

  const sanitizedTitle = sanitizeString(title);

  // Ensure uniqueId is always defined, using ISBN if available, or a fallback UUID
  const uniqueId = isbn ?? randomUUID().replace(/-/g, "");

  // Calculate maximum allowed title length, leaving space for unique ID and hyphen
  const maxTitleLength = 255 - (uniqueId.length + 1); // +1 for the hyphen
  const truncatedTitle =
    sanitizedTitle.length > maxTitleLength
      ? sanitizedTitle.slice(0, maxTitleLength)
      : sanitizedTitle;

  // Combine title and unique ID to form the slug
  const slug = `${truncatedTitle}-${uniqueId}`;

  return slug;
}
