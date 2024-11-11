import { inferSchema, initParser } from "udsv";

export interface CSVBook {
  shelves: string[];
  title: string;
  author: string;
  isbn: string;
}

function safeString(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" && !isNaN(value)) return value.toString();
  return "";
}

function mapStoryGraphSchema(data: Record<string, unknown>[]): CSVBook[] {
  return data.map((item) => ({
    shelves: safeString(item.Tags)
      .split(",")
      .map((tag) => tag.trim()),
    title: safeString(item.Title),
    author: safeString(item.Authors),
    isbn: safeString(item["ISBN/UID"]),
  }));
}

function mapGoodReadsSchema(data: Record<string, unknown>[]): CSVBook[] {
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
): CSVBook[] {
  if (csvObject.length === 0) throw new Error("CSV file is empty");

  if (Object.prototype.hasOwnProperty.call(csvObject[0], "Bookshelves")) {
    return mapGoodReadsSchema(csvObject);
  } else if (Object.prototype.hasOwnProperty.call(csvObject[0], "Tags")) {
    return mapStoryGraphSchema(csvObject);
  }

  throw new Error("Invalid CSV file");
}

export const parseCSVIntoBooks = (csvContent: string): CSVBook[] => {
  const schema = inferSchema(csvContent);
  const parser = initParser(schema);
  const data = parser.typedObjs(csvContent);
  const records = extractDataFromCSVObject(data);

  return records;
};
