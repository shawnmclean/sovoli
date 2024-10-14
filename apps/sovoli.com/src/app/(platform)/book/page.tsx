import { findBookByISBN, searchBooksByQuery } from "@sovoli/api/services";

export const dynamic = "force-dynamic";

export default async function BookPage() {
  const response = await searchBooksByQuery({
    query: "The Interpretation of Dreams Sigmung Freud",
  });

  if (!response.books[0]) {
    return <div>No book found</div>;
  }

  const book = response.books[0];

  const responseIsbn = await findBookByISBN({ isbn: "9780195122350" });

  if (!responseIsbn.book) {
    return <div>No book found</div>;
  }

  const bookIsbn = responseIsbn.book;

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
      <hr />
      <p>
        Book title: {bookIsbn.title}
        <br />
        Book description: {bookIsbn.description}
        <br />
        Id: {bookIsbn.id}
        <br />
        ISBN10: {bookIsbn.isbn10}
        <br />
        ISBN13: {bookIsbn.isbn13}
      </p>
    </div>
  );
}
