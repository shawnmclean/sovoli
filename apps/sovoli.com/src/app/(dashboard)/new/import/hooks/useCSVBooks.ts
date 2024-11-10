import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { inferSchema, initParser } from "udsv";

export interface NormalizedBooks {
  shelves: string[];
  title: string;
  author: string;
  isbn: string;
}

export interface GroupedBooks {
  name: string;
  books: Omit<NormalizedBooks, "shelves">[];
}

function safeString(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" && !isNaN(value)) return value.toString();
  return "";
}

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
  if (csvObject.length === 0) throw new Error("CSV file is empty");

  if (Object.prototype.hasOwnProperty.call(csvObject[0], "Bookshelves")) {
    return mapGoodReadsSchema(csvObject);
  } else if (Object.prototype.hasOwnProperty.call(csvObject[0], "Tags")) {
    return mapStoryGraphSchema(csvObject);
  }

  throw new Error("Invalid CSV file");
}

function groupBooksByShelves(books: NormalizedBooks[]): GroupedBooks[] {
  const shelvesMap: Record<string, Omit<NormalizedBooks, "shelves">[]> = {};

  books.forEach((book) => {
    book.shelves.forEach((shelf) => {
      if (!shelvesMap[shelf]) {
        shelvesMap[shelf] = [];
      }
      shelvesMap[shelf].push({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
      });
    });
  });

  return Object.entries(shelvesMap).map(([name, books]) => ({
    name,
    books,
  }));
}

export interface ParsedBooksResult {
  shelves: GroupedBooks[];
  totalBooks: number;
}

export interface UseCSVBooksOptions {
  onBooksParsed: (result: ParsedBooksResult) => void;
}

export const useCSVBooks = ({ onBooksParsed }: UseCSVBooksOptions) => {
  const [parsedBooks, setParsedBooks] = useState<ParsedBooksResult | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const csvContent = event.target?.result as string;
        let result: ParsedBooksResult;
        try {
          const schema = inferSchema(csvContent);
          const parser = initParser(schema);
          const data = parser.typedObjs(csvContent);
          const records = extractDataFromCSVObject(data);

          const shelves = groupBooksByShelves(records);
          result = { shelves, totalBooks: records.length };

          setParsedBooks(result);
          onBooksParsed(result);
          setError(null);
        } catch (e) {
          if (e instanceof Error) {
            setError(e.message);
          } else {
            setError("An unknown error occurred");
          }
        }
      };
      reader.readAsText(file);
    },
    [onBooksParsed],
  );

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: { "text/csv": [".csv"] },
    onDrop,
  });

  return { getRootProps, getInputProps, parsedBooks, error };
};
