"use server";

import { findBookByISBN } from "@sovoli/api/services";

export async function createConnection(isbn: string) {
  const response = await findBookByISBN({
    isbn,
  });

  return response.book;
}
