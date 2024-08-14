import type { Metadata } from "next";
import { ShelfScreen } from "@sovoli/ui/screens/mybooks/shelf";

import { getQueryClientRsc } from "~/api/query-client";
import { tsr } from "~/api/tsr";
import { config } from "~/utils/config";

export const dynamic = "force-dynamic";

interface Props {
  params: { username: string; slug: string };
  searchParams: { page: number | undefined };
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const client = tsr.initQueryClient(getQueryClientRsc());
  const { body } = await client.getShelfBooks.fetchQuery({
    queryKey: ["username", "slug"],
    queryData: {
      params: {
        username: params.username,
        slug: params.slug,
      },
      query: {
        page: searchParams.page,
      },
    },
  });

  const shelf = body.shelf;
  const coverImage = shelf.images?.[0];

  return {
    title: shelf.name,
    description: shelf.description,
    openGraph: {
      title: shelf.name,
      description: shelf.description ?? config.description,
      url: config.url + "/" + params.username + "/shelves/" + params.slug,
      siteName: config.siteName,
      images: coverImage && [
        {
          url: coverImage.url,
        },
      ],
    },
  };
}

export default async function ShelfPage({ params, searchParams }: Props) {
  const client = tsr.initQueryClient(getQueryClientRsc());
  const { body } = await client.getShelfBooks.fetchQuery({
    queryKey: ["username", "slug"],
    queryData: {
      params: {
        username: params.username,
        slug: params.slug,
      },
      query: {
        page: searchParams.page,
      },
    },
  });

  return <ShelfScreen shelf={body} />;
}
