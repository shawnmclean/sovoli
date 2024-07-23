import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";
import { eq } from "@sovoli/db";
import { users } from "@sovoli/db/schema";

import { publicProcedure } from "../trpc";

export const userRouter = {
  byUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.users.findFirst({
        where: eq(users.username, input.username),
      });
    }),
} satisfies TRPCRouterRecord;
