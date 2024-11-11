"use client";

import { useState } from "react";

import type { GroupedCSVBooks } from "../lib/groupCSVBooksByShelves";
import { importShelfAction } from "../actions/importShelfAction";
import { groupCSVBooksByShelves } from "../lib/groupCSVBooksByShelves";
import { parseCSVIntoBooks } from "../lib/parseCSVIntoBooks";
import { CSVFileInput } from "./CSVFileInput";

export interface ShelfImportFormProps {
  userCollections: {
    id: string;
    name: string;
    type: "shelf" | "collection";
    itemCount: number;
  }[];
}

export const ShelfImportForm = ({ userCollections }: ShelfImportFormProps) => {
  const [groupedBooks, setGroupedBooks] = useState<GroupedCSVBooks[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileDropped = (file: File) => {
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvContent = event.target?.result as string;

        try {
          const books = parseCSVIntoBooks(csvContent); // Pass csvContent as a string
          const grouped = groupCSVBooksByShelves(books);
          setGroupedBooks(grouped);
          setError(null); // Clear any previous errors
        } catch {
          setError(
            "Failed to parse the CSV file. Please check the format and try again.",
          );
        }
      };

      reader.onerror = () => {
        setError("Error reading the file. Please try again.");
      };

      reader.readAsText(file);
    } catch {
      setError("Failed to read the file. Please try again.");
    }
  };

  return (
    <section className="container mx-auto p-4">
      <form action={importShelfAction}>
        <CSVFileInput onFileDropped={handleFileDropped} name="csvFile" />

        {error && (
          <div className="mt-4 rounded-md bg-red-100 p-4 text-red-600 shadow-md">
            <p className="text-lg font-semibold">{error}</p>
          </div>
        )}

        {groupedBooks.map((shelf) => (
          <ShelfItem
            key={shelf.name}
            name={shelf.name}
            booksCount={shelf.books.length}
            userCollections={userCollections}
          />
        ))}

        <button type="submit" className="btn btn-primary">
          Import
        </button>
      </form>
    </section>
  );
};

const ShelfItem = ({
  name,
  booksCount,
  userCollections,
}: {
  name: string;
  booksCount: number;
  userCollections: {
    id: string;
    name: string;
    type: "shelf" | "collection";
    itemCount: number;
  }[];
}) => {
  const [isAddEnabled, setIsAddEnabled] = useState(false);
  const [selectedValue, setSelectedValue] = useState("new-shelf");

  const handleAddCheckboxChange = () => {
    setIsAddEnabled((prev) => !prev);
  };

  const handleDropdownChange = (value: string) => {
    setSelectedValue(value);
  };

  return (
    <div className="rounded-lg p-4 shadow-md dark:bg-gray-700">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {name} ({booksCount})
        </h3>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="form-checkbox"
            checked={isAddEnabled}
            onChange={handleAddCheckboxChange}
          />
          <span className="text-gray-700 dark:text-gray-300">Add</span>
        </label>
      </div>

      <select
        className={`mt-2 w-full rounded border p-2 ${
          !isAddEnabled ? "opacity-50" : ""
        }`}
        name="collection"
        value={selectedValue}
        onChange={(e) => handleDropdownChange(e.target.value)}
        disabled={!isAddEnabled}
      >
        <option value="new-shelf">New Shelf</option>
        {userCollections.map((collection) => (
          <option key={collection.id} value={collection.id}>
            {collection.name} ({collection.itemCount})
          </option>
        ))}
      </select>

      {selectedValue === "new-shelf" && isAddEnabled && (
        <div className="mt-2">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="form-checkbox" />
            <span className="text-gray-700 dark:text-gray-300">Shelf</span>
          </label>
        </div>
      )}
    </div>
  );
};
