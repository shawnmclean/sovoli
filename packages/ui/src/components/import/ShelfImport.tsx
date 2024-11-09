"use client";

import { useState } from "react";

import { GroupedBooks, NormalizedBooks } from "./hooks/useCSVBooks";
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
  const [books, setBooks] = useState<NormalizedBooks[]>([]);
  const [groupedBooks, setGroupedBooks] = useState<GroupedBooks[]>([]);
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>(
    {},
  );

  // Function to handle parsed books
  const handleBooksParsed = (parsedBooks: NormalizedBooks[]) => {
    setBooks(parsedBooks);
    const grouped = groupBooksByShelves(parsedBooks);
    setGroupedBooks(grouped);
  };

  // Function to handle dropdown change
  const handleDropdownChange = (shelfName: string, value: string) => {
    setSelectedValues((prev) => ({
      ...prev,
      [shelfName]: value,
    }));
  };

  // Function to group books by shelves (you may already have this in a utility file)
  function groupBooksByShelves(books: NormalizedBooks[]): GroupedBooks[] {
    const shelvesMap: Record<string, Omit<NormalizedBooks, "shelves">[]> = {};
    books.forEach((book) => {
      book.shelves.forEach((shelf) => {
        if (!shelvesMap[shelf]) {
          shelvesMap[shelf] = [];
        }
        const { shelves, ...bookWithoutShelves } = book;
        shelvesMap[shelf].push(bookWithoutShelves);
      });
    });

    return Object.entries(shelvesMap).map(([name, books]) => ({
      name,
      books,
    }));
  }

  return (
    <section className="container mx-auto p-4">
      <ReadCSV onBooksParsed={handleBooksParsed} />

      {/* Dashboard Box for Counts */}
      <div className="mt-6 flex justify-around rounded-lg bg-gray-100 p-4 shadow-md dark:bg-gray-800">
        <div className="text-center">
          <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Total Books
          </h4>
          <p className="text-xl font-semibold text-gray-600 dark:text-gray-400">
            {books.length}
          </p>
        </div>
        <div className="text-center">
          <h4 className="text-2xl font-bold text-red-600 dark:text-red-400">
            Errors
          </h4>
          <p className="text-xl font-semibold text-red-600 dark:text-red-400">
            {
              books.filter((book) => !book.title || !book.author || !book.isbn)
                .length
            }
          </p>
        </div>
      </div>

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
