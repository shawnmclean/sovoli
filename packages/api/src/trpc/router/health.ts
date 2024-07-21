import type { TRPCRouterRecord } from "@trpc/server";
// import { z } from "zod";
// import { eq } from "@sovoli/db";
// import { User } from "@sovoli/db/schema";

import { publicProcedure } from "../trpc";

export const healthRouter = {
  check: publicProcedure.query(() => {
    return { status: "ok" };
  }),
} satisfies TRPCRouterRecord;
