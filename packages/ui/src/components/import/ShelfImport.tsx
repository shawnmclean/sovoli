"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { inferSchema, initParser } from "udsv";

interface NormalizedBooks {
  shelves: string[];
  title: string;
  author: string;
  isbn: string;
}
interface GroupedBooks {
  name: string;
  books: Omit<NormalizedBooks, "shelves">[];
}

function safeString(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" && !isNaN(value)) return value.toString();
  return "";
}

// Function to map data from StoryGraph Schema
function mapStoryGraphSchema(
  data: Record<string, unknown>[],
): NormalizedBooks[] {
  return data.map((item) => ({
    shelves: safeString(item.Tags)
      .split(",")
      .map((tag) => tag.trim()),
    title: safeString(item.Title),
    author: safeString(item.Authors),
    isbn: safeString(item["ISBN/UID"]),
  }));
}

function mapGoodReadsSchema(
  data: Record<string, unknown>[],
): NormalizedBooks[] {
  return data.map((item) => {
    const cleanISBN = (isbn: unknown): string => {
      return safeString(isbn)
        .replace(/^="|"$|=/g, "")
        .trim();
    };

    return {
      shelves: safeString(item.Bookshelves)
        .split(",")
        .map((shelf) => shelf.trim()),
      title: safeString(item.Title),
      author: safeString(item.Author),
      isbn: cleanISBN(item.ISBN13 ?? item.ISBN),
    };
  });
}

function extractDataFromCSVObject(
  csvObject: Record<string, unknown>[],
): NormalizedBooks[] {
  if (csvObject.length === 0) return [];

  if (Object.prototype.hasOwnProperty.call(csvObject[0], "Bookshelves")) {
    return mapGoodReadsSchema(csvObject);
  } else if (Object.prototype.hasOwnProperty.call(csvObject[0], "Tags")) {
    return mapStoryGraphSchema(csvObject);
  }

  return [];
}

function groupBooksByShelves(books: NormalizedBooks[]): GroupedBooks[] {
  const shelvesMap: Record<string, Omit<NormalizedBooks, "shelves">[]> = {};

  books.forEach((book) => {
    book.shelves.forEach((shelf) => {
      if (!shelvesMap[shelf]) {
        shelvesMap[shelf] = [];
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { shelves, ...bookWithoutShelves } = book;
      shelvesMap[shelf].push(bookWithoutShelves);
    });
  });

  return Object.entries(shelvesMap).map(([name, books]) => ({
    name,
    books,
  }));
}

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

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: { "text/csv": [".csv"] },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const csvContent = event.target?.result as string;
        const schema = inferSchema(csvContent);
        const parser = initParser(schema);
        const data = parser.typedObjs(csvContent);
        const records = extractDataFromCSVObject(data);

        const sortedRecords = records.sort((a, b) => {
          const aIsInvalid = !a.title || !a.author || !a.isbn;
          const bIsInvalid = !b.title || !b.author || !b.isbn;
          return Number(bIsInvalid) - Number(aIsInvalid);
        });

        const groupedBooks = groupBooksByShelves(sortedRecords);
        setGroupedBooks(groupedBooks);
        setBooks(sortedRecords);
      };
      reader.readAsText(file);
    },
  });

  const handleDropdownChange = (shelfName: string, value: string) => {
    setSelectedValues((prev) => ({
      ...prev,
      [shelfName]: value,
    }));
  };

  return (
    <section className="container mx-auto p-4">
      <div
        {...getRootProps({
          className:
            "dropzone border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:bg-gray-100 transition-colors dark:border-gray-600 dark:hover:bg-gray-700",
        })}
      >
        <input {...getInputProps()} />
        <p className="text-gray-600 dark:text-gray-300">
          Drag 'n' drop some files here, or click to select files
        </p>
      </div>

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
