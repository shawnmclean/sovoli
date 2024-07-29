/** @jsxImportSource react */

import { Suspense } from "react";
import { dehydrate } from "@tanstack/query-core";
import { HydrationBoundary } from "@tanstack/react-query";
import { api, HydrateClient } from "~/api/trpc/server";
import { api as restApi } from "~/api/rest/api-client";
import { createQueryClient } from "~/api/query-client";
import { Shelf } from "./_components/Shelf";

export default function ShelfPage({
  params,
}: {
  params: { username: string; slug: string };
}) {
  const client = createQueryClient();
  // void api.shelf.bySlug.prefetch({
  //   username: params.username,
  //   slug: params.slug,
  // });

  void restApi.getShelf.prefetchQuery(client, ["username", "slug"], {
    params: {
      username: params.username,
      slug: params.slug,
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
