


import { Suspense } from "react";
import { dehydrate } from "@tanstack/query-core";
import { HydrationBoundary } from "@tanstack/react-query";
import { Shelf } from "./_components/Shelf";
import { tsr, queryClient } from "~/api/tsr";

export default function ShelfPage({
  params,
}: {
  params: { username: string; slug: string };
}) {
  const client = tsr.initQueryClient(queryClient());
  void client.getShelfBooks.prefetchQuery({
    queryKey: ["username", "slug"],
    queryData: {
      params: {
        username: params.username,
        slug: params.slug,
      },
    },
  });

  // void client.getShelfBooks.prefetchQuery({
  //   queryKey: ["username", "slug"],
  //   queryData: {
  //     params: {
  //       username: params.username,
  //       slug: params.slug,
  //     },
  //     query: {
  //       page:1
  //     }
  //   },
  // });

  const dehydratedState = dehydrate(client);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense fallback={<div>Loading...</div>}>
        <Shelf {...params} />
      </Suspense>
    </HydrationBoundary>
  );
}
