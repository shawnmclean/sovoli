"use client";

import type { AppRouter } from "@sovoli/api/trpc";
import { useState } from "react";
import {
  defaultShouldDehydrateQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
// import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import SuperJSON from "superjson";

// import { env } from "~/env";
// import { getBaseUrl } from "~/utils/getBaseUrl";
// import { getQueryClient } from "./query-client";
import { tsr } from "./tsr";

export const trpc = createTRPCReact<AppRouter>();

export function QueryProviders(props: { children: React.ReactNode }) {
  const [trpcClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 30 * 1000,
          },
          dehydrate: {
            serializeData: SuperJSON.serialize,
            shouldDehydrateQuery: (query) =>
              defaultShouldDehydrateQuery(query) ||
              query.state.status === "pending",
          },
          hydrate: {
            deserializeData: SuperJSON.deserialize,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={trpcClient}>
      <tsr.ReactQueryProvider>{props.children}</tsr.ReactQueryProvider>
    </QueryClientProvider>
  );
}
