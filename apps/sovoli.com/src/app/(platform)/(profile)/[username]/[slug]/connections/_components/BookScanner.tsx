"use client";

import type { SelectBookSchema } from "@sovoli/db/schema";
import { useState } from "react";
import { BarcodeReader } from "@sovoli/ui/components/BarcodeReader";

import { createConnection } from "../actions";

export function BookScanner() {
  const [books, setBooks] = useState<SelectBookSchema[]>([]);

  const handleISBNFound = async (isbn: string) => {
    const book = await createConnection(isbn);
    if (!book) return;
    setBooks([...books, book]);
  };

  return (
    <div>
      <BarcodeReader onISBNFound={handleISBNFound} />

      {books.map((book) => (
        <p key={book.id}>{book.title}</p>
      ))}
    </div>
  );
}
