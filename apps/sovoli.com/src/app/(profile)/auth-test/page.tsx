import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClientRsc } from "~/api/query-client";
import { tsrReactQuery } from "~/api/tsr";
import { Me } from "../settings/_components/Me";

export default async function SettingsPage() {
  const client = tsrReactQuery.initQueryClient(getQueryClientRsc());
  await client.prefetchQuery({
    queryKey: ["me"],
  });

  return (
    <div className="min-h-screen dark:bg-black sm:pl-60">
      <h1>React Query Auth Test</h1>

      <HydrationBoundary state={dehydrate(client)}>
        <Suspense fallback={<div>Loading...</div>}>
          <Me />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}
