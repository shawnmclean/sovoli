"use client";

import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import SuperJSON from "superjson";

import type { AppRouter } from "@sovoli/api/trpc";
import { tsr } from "./tsr";

import { env } from "~/env";
import { getBaseUrl } from "~/utils/getBaseUrl";
import { getQueryClient } from "./query-client";

export const trpc = createTRPCReact<AppRouter>();

export function QueryProviders(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          transformer: SuperJSON,
          url: getBaseUrl() + "/api/trpc",
          headers() {
            const headers = new Headers();
            headers.set("x-trpc-source", "nextjs-react");
            return headers;
          },
        }),
      ],
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <tsr.ReactQueryProvider>{props.children}</tsr.ReactQueryProvider>
      </trpc.Provider>
    </QueryClientProvider>
  );
}
