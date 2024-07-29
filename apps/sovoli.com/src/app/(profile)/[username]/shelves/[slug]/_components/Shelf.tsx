"use client";

import { api } from "~/api/trpc/react";
import { api as restApi } from "~/api/rest/api-client";
import { ShelfScreen } from "@sovoli/ui/screens/mybooks/shelf";

export function Shelf({ username, slug }: { username: string; slug: string }) {
  // const [shelf] = api.shelf.bySlug.useSuspenseQuery({ slug, username });
  const { data } = restApi.getShelf.useQuery(["username", "slug"], {
    params: {
      username,
      slug,
    },
  });

  const shelf = data?.body;

  if (!shelf) {
    return null;
  }

  return (
    <>
      <h1>{shelf.slug}</h1>
      <ShelfScreen shelf={shelf} />
    </>
  );
}
