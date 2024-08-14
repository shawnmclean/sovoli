import type { Metadata } from "next";
import { Suspense } from "react";
import { dehydrate } from "@tanstack/query-core";
import { HydrationBoundary } from "@tanstack/react-query";

import { getQueryClientRsc } from "~/api/query-client";
import { tsr } from "~/api/tsr";
import { config } from "~/utils/config";
import { Shelf } from "./_components/Shelf";

export const dynamic = "force-dynamic";

interface Props {
  params: { username: string; slug: string };
  searchParams: { page: number | undefined };
}

const client = tsr.initQueryClient(getQueryClientRsc(true));
export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
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

export default function ShelfPage({ params, searchParams }: Props) {
  void client.getShelfBooks.prefetchQuery({
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

  const dehydratedState = dehydrate(client);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense fallback={<div>Loading...</div>}>
        <Shelf {...params} {...searchParams} />
      </Suspense>
    </HydrationBoundary>
  );
}
