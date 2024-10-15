import { getBookFromISBNdb } from "@sovoli/api/services";

import { BookScanner } from "./_components/BookScanner";

export const dynamic = "force-dynamic";

interface Props {
  params: { username: string; slug: string };
  searchParams: { page: number | undefined; pageSize: number | undefined };
}

export default async function ConnectionsEditPage({
  params: { username, slug },
}: Props) {
  const book = await getBookFromISBNdb({
    isbn: "9798686284968",
  });
  return (
    <div className="min-h-screen sm:pl-60 dark:bg-black">
      <h1>
        Scan Book By ISBN - {username}/{slug}
      </h1>
      <pre>{JSON.stringify(book, null, 2)}</pre>
      <BookScanner />
    </div>
  );
}
