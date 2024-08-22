import { notFound } from "next/navigation";
import { MyBooksScreen } from "@sovoli/ui/screens/mybooks";

import { getQueryClientRsc } from "~/api/query-client";
import { tsr } from "~/api/tsr";

export const dynamic = "force-dynamic";

interface Props {
  params: { username: string };
  searchParams: { page: number | undefined };
}

async function getUserMyBooksProfile({ params, searchParams }: Props) {
  const client = tsr.initQueryClient(getQueryClientRsc());
  try {
    return await client.getUserMyBooksProfile.fetchQuery({
      queryKey: ["username", "slug"],
      queryData: {
        params: {
          username: params.username,
        },
        query: {
          page: searchParams.page,
        },
      },
    });
  } catch (error) {
    // Type guard to check if error is an object with a 'status' property
    if (typeof error === "object" && error !== null && "status" in error) {
      const status = (error as { status?: number }).status; // Safe type assertion

      if (status === 404) return null;
    }
  }
}

export default async function MyBooks({ params, searchParams }: Props) {
  const response = await getUserMyBooksProfile({ params, searchParams });

  if (!response) return notFound();

  return (
    <div className="min-h-screen dark:bg-black sm:pl-60">
      <h1>My books: {response.body.name}</h1>
      <p>{response.body.myBooks.data.length} books</p>
      {response.body.myBooks.data.map((book) => (
        <p>{book.id}</p>
      ))}
      <MyBooksScreen profile={response.body} />
    </div>
  );
}
