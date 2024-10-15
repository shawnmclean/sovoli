"use client";

import { useState } from "react";
import { BarcodeReader } from "@sovoli/ui/components/BarcodeReader";

export function BookScanner() {
  // const [books, setBooks] = useState<SelectBookSchema[]>([]);
  const [isbns, setIsbns] = useState<string[]>([]);

  const handleISBNFound = (isbn: string) => {
    setIsbns([...isbns, isbn]);
    // const book = await createConnection(isbn);
    // if (!book) return;
    // setBooks([...books, book]);
  };

  return (
    <div>
      <BarcodeReader onISBNFound={handleISBNFound} />

      {isbns.map((isbn) => (
        <p key={isbn}>{isbn}</p>
      ))}
    </div>
  );
}
