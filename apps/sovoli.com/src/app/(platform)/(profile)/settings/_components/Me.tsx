"use client";

import { tsrReactQuery } from "~/api/tsr";

export function Me() {
  const { data } = tsrReactQuery.user.me.useSuspenseQuery({
    queryKey: ["me"],
    queryData: {
      fetchOptions: {
        cache: "no-store",
      },
    },
  });

  const me = data.body;

  return (
    <>
      <h1>Suspense query</h1>
      <p>Name from API: {me.name}</p>
    </>
  );
}
