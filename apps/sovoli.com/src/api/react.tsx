"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { getQueryClient } from "./query-client";
import { tsrReactQuery } from "./tsr";

export function QueryProviders({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient(true);

  return (
    <QueryClientProvider client={queryClient}>
      <tsrReactQuery.ReactQueryProvider>
        {children}
      </tsrReactQuery.ReactQueryProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
