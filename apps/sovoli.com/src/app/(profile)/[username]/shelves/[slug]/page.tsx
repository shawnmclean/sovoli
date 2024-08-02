


import { Suspense } from "react";
import { dehydrate } from "@tanstack/query-core";
import { HydrationBoundary } from "@tanstack/react-query";
// import { api, HydrateClient } from "~/api/trpc/server";
import { Shelf } from "./_components/Shelf";
import { tsr, queryClient } from "~/api/tsr";

export default function ShelfPage({
  params,
}: {
  params: { username: string; slug: string };
}) {
  const client = tsr.initQueryClient(queryClient());
  void client.getShelf.prefetchQuery({
    queryKey: ["username", "slug"],
    queryData: {
      params: {
        username: params.username,
        slug: params.slug,
      },
    },
  });

  const dehydratedState = dehydrate(client);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense fallback={<div>Loading...</div>}>
        <Shelf {...params} />
      </Suspense>
    </HydrationBoundary>
  );
}
