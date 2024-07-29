"use client";

import { api } from "~/api/trpc/react";
import { ShelfScreen } from "@sovoli/ui/screens/mybooks/shelf";

export function Shelf({ username, slug }: { username: string; slug: string }) {
  const [shelf] = api.shelf.bySlug.useSuspenseQuery({ slug, username });

  if (!shelf) {
    return null;
  }

  return (
    <>
      <h1>
        {shelf.username} - {shelf.slug}
      </h1>
      <ShelfScreen shelf={shelf} />
    </>
  );
}
