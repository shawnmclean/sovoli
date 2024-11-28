import type { InsertBook, SelectBook } from "@sovoli/db/schema";
import { db, schema, sql } from "@sovoli/db";

export const upsertBooks = async (
  books: InsertBook[],
): Promise<SelectBook[]> => {
  const insertedBooks = await db
    .insert(schema.Book)
    .values(books)
    .onConflictDoUpdate({
      target: [schema.Book.isbn10, schema.Book.isbn13],
      set: {
        title: sql.raw(`excluded.${schema.Book.title.name}`), // Update the title if there's a conflict
        longTitle: sql.raw(`excluded.${schema.Book.longTitle.name}`), // Update the long title
        language: sql.raw(`excluded.${schema.Book.language.name}`), // Update the language field
        image: sql.raw(`excluded.${schema.Book.image.name}`), // Update the image URL
        dimensions: sql.raw(`excluded.${schema.Book.dimensions.name}`), // Update dimensions if changed
        structuredDimensions: sql.raw(
          `excluded.${schema.Book.structuredDimensions.name}`,
        ), // Update structured dimensions
        pageCount: sql.raw(`excluded.${schema.Book.pageCount.name}`), // Update the page count
        subjects: sql.raw(`excluded.${schema.Book.subjects.name}`), // Update subjects array
        authors: sql.raw(`excluded.${schema.Book.authors.name}`), // Update authors array
        publishedDate: sql.raw(`excluded.${schema.Book.publishedDate.name}`), // Update published date
        publisher: sql.raw(`excluded.${schema.Book.publisher.name}`), // Update the publisher if there's a conflict
        binding: sql.raw(`excluded.${schema.Book.binding.name}`), // Update the binding type (e.g., Hardcover, Paperback)
        otherISBNs: sql.raw(`excluded.${schema.Book.otherISBNs.name}`), // Update other ISBNs array
        description: sql.raw(`excluded.${schema.Book.description.name}`), // Update description (overview or synopsis)
        subtitle: sql.raw(`excluded.${schema.Book.subtitle.name}`), // Update subtitle if changed
        lastISBNdbUpdated: sql.raw(
          `excluded.${schema.Book.lastISBNdbUpdated.name}`,
        ),
      },
    })
    .returning();

  return insertedBooks;
};
