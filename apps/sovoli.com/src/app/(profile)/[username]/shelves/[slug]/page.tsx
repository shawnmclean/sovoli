/** @jsxImportSource react */

import { Suspense } from "react";
import { api, HydrateClient } from "~/trpc/server";
import { Shelf } from "./_components/Shelf";

export default function ShelfPage({
  params,
}: {
  params: { username: string; slug: string };
}) {
  void api.shelf.bySlug.prefetch({
    username: params.username,
    slug: params.slug,
  });

  return (
    <HydrateClient>
      <Suspense fallback={<div>Loading...</div>}>
        <Shelf {...params} />
      </Suspense>
    </HydrateClient>
  );
}
