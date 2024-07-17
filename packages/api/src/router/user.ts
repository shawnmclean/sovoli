import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";
import { eq } from "@sovoli/db";
import { User } from "@sovoli/db/schema";

import { publicProcedure } from "../trpc";

export const userRouter = {
  byUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      console.log(">>> input", input);
      const user = await ctx.db.query.User.findFirst({
        where: eq(User.username, input.username),
      });
      console.log(">>> user", user);
      return user;
    }),
} satisfies TRPCRouterRecord;
