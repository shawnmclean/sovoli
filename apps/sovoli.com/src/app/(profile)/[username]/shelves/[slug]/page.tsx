import type { Metadata } from "next";
import { Suspense } from "react";
import { dehydrate } from "@tanstack/query-core";
import { HydrationBoundary } from "@tanstack/react-query";

import { getQueryClientRsc } from "~/api/query-client";
import { tsr } from "~/api/tsr";
import { config } from "~/utils/config";
import { Shelf } from "./_components/Shelf";

interface Props {
  params: { username: string; slug: string };
  searchParams: { page: number | undefined };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const client = tsr.initQueryClient(getQueryClientRsc());
  await client.invalidateQueries({ queryKey: ["username", "slug"] });
  const { body } = await client.getShelf.fetchQuery({
    queryKey: ["username", "slug"],
    queryData: {
      params: {
        username: params.username,
        slug: params.slug,
      },
    },
  });

  const coverImage = body.images?.[0];

  return {
    title: body.name,
    description: body.description,
    openGraph: {
      title: body.name,
      description: body.description ?? config.description,
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
  const client = tsr.initQueryClient(getQueryClientRsc());
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
