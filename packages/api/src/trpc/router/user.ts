import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";
import { eq } from "@sovoli/db";
import { User } from "@sovoli/db/schema";

import { publicProcedure } from "../trpc";

export const userRouter = {
  byUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.User.findFirst({
        where: eq(User.username, input.username),
      });
    }),
} satisfies TRPCRouterRecord;
