import type { CSVBook } from "./parseCSVIntoBooks";

export interface GroupedCSVBooks {
  name: string;
  books: Omit<CSVBook, "shelves">[];
}
export const groupCSVBooksByShelves = (books: CSVBook[]): GroupedCSVBooks[] => {
  const shelvesMap: Record<string, Omit<CSVBook, "shelves">[]> = {};

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
};
