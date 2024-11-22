import type { SelectBook } from "@sovoli/db/schema";
import { db, eq, or, schema } from "@sovoli/db";

import { getBookFromISBNdb } from "../isbndb";
import { upsertBooks } from "./insert";

export interface FindBookByISBNOptions {
  isbn: string;
}

export interface FindBookByISBNResult {
  /**
   * book matching the query
   */
  book?: SelectBook;
}

export const findBookByISBN = async ({
  isbn,
}: FindBookByISBNOptions): Promise<FindBookByISBNResult> => {
  const internalBook = await db.query.Book.findFirst({
    where: or(eq(schema.Book.isbn10, isbn), eq(schema.Book.isbn13, isbn)),
  });

  if (internalBook) {
    console.log("found book in internal db");
    return {
      book: internalBook,
    };
  }

  console.log("no internal results, searching externally");

  const externalBook = await getBookFromISBNdb({ isbn });

  if (!externalBook) {
    console.log("no external book found");
    return {};
  }

  console.log("found external book");
  // save book to db
  const [upsertBook] = await upsertBooks([externalBook]);

  console.log("upserted book");

  return {
    book: upsertBook,
  };
};
