import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { publicProcedure } from "../trpc";
import { shelves } from "./shelves";

export const shelfRouter = {
  bySlug: publicProcedure
    .input(z.object({ username: z.string(), slug: z.string() }))
    .query(({ input }) => {
      return shelves.find(
        (shelf) =>
          shelf.username === input.username && shelf.slug === input.slug
      );
    }),
} satisfies TRPCRouterRecord;
