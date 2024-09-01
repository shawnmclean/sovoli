import { notFound } from "next/navigation";
import MyBookDetailsScreen from "@sovoli/ui/screens/mybooks/details";

import { getQueryClientRsc } from "~/api/query-client";
import { tsrReactQuery } from "~/api/tsr";

export const dynamic = "force-dynamic";

interface Props {
  params: { username: string; slug: string };
}

async function getMyBooks({ params }: Props) {
  const client = tsrReactQuery.initQueryClient(getQueryClientRsc());
  try {
    return await client.getMyBook.fetchQuery({
      queryKey: ["username", "slug"],
      queryData: {
        params: {
          username: params.username,
          slug: params.slug,
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
export default async function MyBookDetails({ params }: Props) {
  const response = await getMyBooks({ params });

  if (!response) return notFound();
  return (
    <div className="min-h-screen dark:bg-black sm:pl-60">
      <MyBookDetailsScreen myBook={response.body} />
    </div>
  );
}
