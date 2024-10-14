"use client";

import { useState } from "react";
import { BarcodeReader } from "@sovoli/ui/components/BarcodeReader";

export function BookScanner() {
  const [book, setBook] = useState("");

  const handleISBNFound = (isbn: string) => {
    setBook(isbn);
  };
  return (
    <div>
      <BarcodeReader onISBNFound={handleISBNFound} />

      <p>ISBN: {book}</p>
    </div>
  );
}
