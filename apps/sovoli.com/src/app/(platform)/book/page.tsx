import { searchBooksByQuery } from "@sovoli/api/services";

export const dynamic = "force-dynamic";

export default async function BookPage() {
  const response = await searchBooksByQuery({
    query: "robert becker",
  });

  return (
    <div className="min-h-screen sm:pl-60 dark:bg-black">
      <h1>Book Page</h1>
      {response.books.map((book) => (
        <div key={book.id}>
          <h2>{book.title}</h2>
          <p>{book.description}</p>

          <pre>{JSON.stringify(book, null, 2)}</pre>
        </div>
      ))}
    </div>
  );
}
