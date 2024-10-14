import { searchBooksByQuery } from "@sovoli/api/services";

export const dynamic = "force-dynamic";

export default async function BookPage() {
  const response = await searchBooksByQuery({
    query: "The Interpretation of Dreams Sigmung Freud",
  });

  if (!response.books[0]) {
    return <div>No book found</div>;
  }

  const book = response.books[0];

  return (
    <div className="min-h-screen dark:bg-black sm:pl-60">
      <h1>Book Page</h1>
      <p>
        Book title: {book.title}
        <br />
        Book description: {book.description}
        <br />
        Id: {book.id}
        <br />
        ISBN10: {book.isbn10}
        <br />
        ISBN13: {book.isbn13}
      </p>
    </div>
  );
}
