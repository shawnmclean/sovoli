"use client";

import { ShelfScreen } from "@sovoli/ui/screens/mybooks/shelf";

import { tsr } from "~/api/tsr";

export function Shelf({
  username,
  slug,
  page,
}: {
  username: string;
  slug: string;
  page: number | undefined;
}) {
  const { data } = tsr.getShelfBooks.useSuspenseQuery({
    queryKey: ["username", "slug"],
    queryData: {
      params: {
        username,
        slug,
      },
      query: {
        page,
      },
      fetchOptions: {
        cache: "no-store",
      },
    },
  });

  const shelf = data.body;

  return <ShelfScreen shelf={shelf} />;
}
