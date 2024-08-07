import type { Metadata } from "next";
import { Suspense } from "react";
import { dehydrate } from "@tanstack/query-core";
import { HydrationBoundary } from "@tanstack/react-query";

import { client } from "~/api/tsr";
import { Shelf } from "./_components/Shelf";

interface Props {
  params: { username: string; slug: string };
  searchParams: { page: number | undefined };
}

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

  return {
    title: body.shelf.name,
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
