import { Suspense } from "react";
import { dehydrate } from "@tanstack/query-core";
import { HydrationBoundary } from "@tanstack/react-query";

import { queryClient, tsr } from "~/api/tsr";
import { Shelf } from "./_components/Shelf";

export default function ShelfPage({
  params,
  searchParams,
}: {
  params: { username: string; slug: string };
  searchParams: { page: number | undefined };
}) {
  const client = tsr.initQueryClient(queryClient());
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
