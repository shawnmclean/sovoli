import { findBookByISBN } from "@sovoli/api/services";

interface Props {
  params: { isbn: string };
}

export default async function BookPage({ params }: Props) {
  const book = await findBookByISBN({ isbn: params.isbn });

  return (
    <div className="min-h-screen sm:pl-60 dark:bg-black">
      <h1>Book details: {params.isbn}</h1>
      <pre>{JSON.stringify(book, null, 2)}</pre>
    </div>
  );
}
