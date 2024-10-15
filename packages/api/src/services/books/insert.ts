import type { InsertBook, SelectBook } from "@sovoli/db/schema";
import { db, schema } from "@sovoli/db";

export const upsertBooks = async (
  books: InsertBook[],
): Promise<SelectBook[]> => {
  const insertedBooks = await db.insert(schema.Book).values(books).returning();

  //TODO: fire event that book was inserted

  return insertedBooks;
};
