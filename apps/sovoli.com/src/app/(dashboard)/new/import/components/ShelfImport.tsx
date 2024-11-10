"use client";

import { useState } from "react";

import type { GroupedBooks, ParsedBooksResult } from "../hooks/useCSVBooks";
import { ImportForm } from "./ImportForm";
import { ReadCSV } from "./ReadCSV";

export interface ShelfImportProps {
  userCollections: {
    id: string;
    name: string;
    type: "shelf" | "collection";
    itemCount: number;
  }[];
}

export const ShelfImport = ({ userCollections }: ShelfImportProps) => {
  // State to store the grouped books
  const [groupedBooks, setGroupedBooks] = useState<GroupedBooks[]>([]);
  // State to handle selected values for dropdowns

  // Function to handle books parsed from the CSV file
  const handleBooksParsed = (result: ParsedBooksResult) => {
    setGroupedBooks(result.shelves);
  };
  return (
    <section className="container mx-auto p-4">
      <ReadCSV onBooksParsed={handleBooksParsed} />

      <ImportForm
        userCollections={userCollections}
        groupedBooks={groupedBooks}
      />
    </section>
  );
};
