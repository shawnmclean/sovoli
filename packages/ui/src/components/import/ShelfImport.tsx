"use client";

import { useState } from "react";

import type { GroupedBooks, ParsedBooksResult } from "./hooks/useCSVBooks";
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
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>(
    {},
  );

  // Function to handle books parsed from the CSV file
  const handleBooksParsed = (result: ParsedBooksResult) => {
    setGroupedBooks(result.shelves);
  };

  // Function to handle dropdown selection change
  const handleDropdownChange = (shelfName: string, value: string) => {
    setSelectedValues((prev) => ({
      ...prev,
      [shelfName]: value,
    }));
  };

  return (
    <section className="container mx-auto p-4">
      <ReadCSV onBooksParsed={handleBooksParsed} />

      {/* Shelves Grid */}
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {groupedBooks.map((shelf) => (
          <div
            key={shelf.name}
            className="rounded-lg bg-white p-4 shadow-md dark:bg-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {shelf.name} ({shelf.books.length})
            </h3>
            <select
              className="mt-2 w-full rounded border p-2"
              value={selectedValues[shelf.name] ?? "new-shelf"}
              onChange={(e) => handleDropdownChange(shelf.name, e.target.value)}
            >
              <option value="new-shelf">New Shelf</option>
              {userCollections.map((collection) => (
                <option key={collection.id} value={collection.id}>
                  {collection.name} ({collection.itemCount})
                </option>
              ))}
            </select>
            {selectedValues[shelf.name] === "new-shelf" && (
              <div className="mt-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="form-checkbox" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Shelf
                  </span>
                </label>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
