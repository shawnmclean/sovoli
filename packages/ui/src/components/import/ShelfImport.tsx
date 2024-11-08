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

function safeString(value: unknown): string {
  if (value == null) return ""; // Check for null or undefined and return an empty string
  if (typeof value === "string") return value; // Return the string directly if it's already a string
  if (typeof value === "number" && !isNaN(value)) return value.toString(); // Convert valid numbers to strings
  return ""; // Return an empty string for other cases (like NaN or non-string/number types)
}

// Function to map data from StoryGraph Schema
function mapStoryGraphSchema(
  data: Record<string, unknown>[],
): NormalizedBooks[] {
  return data.map((item) => ({
    shelves: safeString(item.Tags)
      .split(",")
      .map((tag) => tag.trim()), // Split tags into an array and trim
    title: safeString(item.Title),
    author: safeString(item.Authors),
    isbn: safeString(item["ISBN/UID"]),
  }));
}

function mapGoodReadsSchema(
  data: Record<string, unknown>[],
): NormalizedBooks[] {
  return data.map((item) => {
    // Helper function to clean ISBN values
    const cleanISBN = (isbn: unknown): string => {
      return safeString(isbn)
        .replace(/^="|"$|=/g, "")
        .trim();
    };

    return {
      shelves: safeString(item.Bookshelves)
        .split(",")
        .map((shelf) => shelf.trim()), // Split shelves into an array and trim
      title: safeString(item.Title),
      author: safeString(item.Author),
      isbn: cleanISBN(item.ISBN13 ?? item.ISBN), // Clean ISBN values
    };
  });
}

function extractDataFromCSVObject(
  csvObject: Record<string, unknown>[],
): NormalizedBooks[] {
  if (csvObject.length === 0) return [];

  // Detect schema based on the presence of certain keys
  if (Object.prototype.hasOwnProperty.call(csvObject[0], "Bookshelves")) {
    return mapGoodReadsSchema(csvObject);
  } else if (Object.prototype.hasOwnProperty.call(csvObject[0], "Tags")) {
    return mapStoryGraphSchema(csvObject);
  }

  return [];
}

export const ShelfImport = () => {
  const [books, setBooks] = useState<NormalizedBooks[]>([]);
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      "text/csv": [".csv"],
    },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) {
        return;
      }
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

          // Convert boolean values to numbers (true -> 1, false -> 0)
          return Number(bIsInvalid) - Number(aIsInvalid); // Sort in descending order (errors first)
        });

        setBooks(sortedRecords);
        console.log(data);
        console.log(sortedRecords);
      };
      reader.readAsText(file);
    },
  });

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

      <aside className="mt-6">
        <h4 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
          Accepted files
        </h4>
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-md border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <thead className="border-b border-gray-200 bg-gray-100 dark:border-gray-600 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
                  Shelf
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
                  Title
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
                  Author
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">
                  ISBN
                </th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => {
                // Check if any field is empty or contains an invalid value
                const isInvalid = !book.title || !book.author || !book.isbn;

                return (
                  <tr
                    key={book.isbn}
                    className={`border-b border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-600 ${
                      isInvalid ? "bg-red-100 dark:bg-red-800" : ""
                    }`}
                  >
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                      {book.shelves.join(", ")}
                    </td>
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                      {book.title}
                    </td>
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                      {book.author}
                    </td>
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                      {book.isbn}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </aside>
    </section>
  );
};
