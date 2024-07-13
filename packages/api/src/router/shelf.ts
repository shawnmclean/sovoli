import { TRPCError } from "@trpc/server";
import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { publicProcedure } from "../trpc";
import { shelves } from "./shelves";

export const shelfRouter = {
  bySlug: publicProcedure
    .input(z.object({ username: z.string(), slug: z.string() }))
    .query(({ input }) => {
      const shelf = shelves.find(
        (shelf) =>
          shelf.username === input.username && shelf.slug === input.slug
      );
      if (!shelf) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return shelf;
    }),
} satisfies TRPCRouterRecord;
