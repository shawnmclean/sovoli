import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MyBooksScreen } from "@sovoli/ui/screens/mybooks";

import { api } from "~/api/tsr";
import { config } from "~/utils/config";

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

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const response = await getUserMyBooksProfile({ params, searchParams });

  if (response.status !== 200) return notFound();

  const user = response.body;
  // const coverImage = shelf.images?.[0];

  return {
    title: `${user.name}'s Books`,
    openGraph: {
      title: `${user.name}'s Books`,
      url: config.url + "/" + params.username + "/mybooks/",
      siteName: config.siteName,
      // images: coverImage && [
      //   {
      //     url: coverImage.url,
      //   },
      // ],
    },
  };
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
