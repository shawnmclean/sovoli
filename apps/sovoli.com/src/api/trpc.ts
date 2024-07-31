import { cache } from "react";
import { headers } from "next/headers";
import { createHydrationHelpers } from "@trpc/react-query/rsc";

import type { AppRouter } from "@sovoli/api/trpc";
import { createCaller, createTRPCContext } from "@sovoli/api/trpc";
// import { auth } from "@acme/auth";

import { getQueryClient } from "./query-client";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(() => {
  const heads = new Headers(headers());
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    // session: await auth(),
    headers: heads,
  });
});

const cachedGetQueryClient = cache(getQueryClient);
const caller = createCaller(createContext);

export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  cachedGetQueryClient
);
