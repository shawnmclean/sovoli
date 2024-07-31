"use client";

import { tsr } from "~/api/tsr";
import { ShelfScreen } from "@sovoli/ui/screens/mybooks/shelf";

export function Shelf({ username, slug }: { username: string; slug: string }) {
  // const [shelf] = api.shelf.bySlug.useSuspenseQuery({ slug, username });
  const { data } = tsr.getShelf.useSuspenseQuery({
    queryKey: ["username", "slug"],
    queryData: {
      params: {
        username,
        slug,
      },
    },
  });

  const shelf = data.body;

  return (
    <>
      <h1>{shelf.slug}</h1>
      <ShelfScreen shelf={shelf} />
    </>
  );
}
