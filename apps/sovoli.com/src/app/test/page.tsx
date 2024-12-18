import { FindBookByISBN } from "~/services/books/findBookByISBN";

export const dynamic = "force-dynamic";

export default async function TestPage() {
  const findBookByISBN = new FindBookByISBN();
  const { book } = await findBookByISBN.call({
    isbn: "9780735211292",
    forceExternal: true,
  });

  return (
    <div>
      <pre>{JSON.stringify(book, null, 2)}</pre>
    </div>
  );
}
