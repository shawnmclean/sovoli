import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";
import { eq, schema } from "@sovoli/db";

import { publicProcedure } from "../trpc";

export const userRouter = {
  byUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.users.findFirst({
        where: eq(schema.users.username, input.username),
      });
    }),
} satisfies TRPCRouterRecord;
