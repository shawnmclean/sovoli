import { notFound } from "next/navigation";
import { MyBooksScreen } from "@sovoli/ui/screens/mybooks";

import { api } from "~/api/tsr";

export const dynamic = "force-dynamic";

interface Props {
  params: { username: string };
  searchParams: { page: number | undefined };
}

async function getUserMyBooksProfile({ params, searchParams }: Props) {
  return await api.getUserMyBooksProfile({
    params: {
      username: params.username,
    },
    query: {
      page: searchParams.page,
    },
    fetchOptions: {
      cache: "no-store",
    },
  });
}

export default async function MyBooks({ params, searchParams }: Props) {
  const response = await getUserMyBooksProfile({ params, searchParams });

  if (response.status !== 200) return notFound();

  return (
    <div className="min-h-screen dark:bg-black sm:pl-60">
      <MyBooksScreen profile={response.body} />
    </div>
  );
}
