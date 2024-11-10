"use client";

import { useState } from "react";

import { importShelfAction } from "../actions/importShelfAction";

// Define the interfaces
interface NormalizedBooks {
  title: string;
  author: string;
  isbn: string;
  shelves: string[];
}

interface GroupedBooks {
  name: string;
  books: Omit<NormalizedBooks, "shelves">[];
}

// ShelfItem Component
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
    <div className="rounded-lg bg-white p-4 shadow-md dark:bg-gray-700">
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

interface ImportFormProps {
  userCollections: {
    id: string;
    name: string;
    type: "shelf" | "collection";
    itemCount: number;
  }[];
  groupedBooks: GroupedBooks[];
}

// ImportForm Component
export const ImportForm = ({
  userCollections,
  groupedBooks,
}: ImportFormProps) => {
  return (
    <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <form action={importShelfAction}>
        <input id="shelves[0].name" name="test[0].name" type="text" />
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
    </div>
  );
};
