"use client";

import { tsr } from "~/api/tsr";
import { ShelfScreen } from "@sovoli/ui/screens/mybooks/shelf";

export function Shelf({ username, slug }: { username: string; slug: string }) {
  // const [shelf] = api.shelf.bySlug.useSuspenseQuery({ slug, username });
  const { data } = tsr.getShelfBooks.useSuspenseQuery({
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
      <ShelfScreen shelf={shelf} />
    </>
  );
}
