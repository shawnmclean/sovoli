import { tsr } from "@ts-rest/serverless/next";
import { eq } from "@sovoli/db";
import { User } from "@sovoli/db/schema";
import { db } from "@sovoli/db/client";

import { userContract } from "./userContract";
import type { Context } from "../../types";

export const userRouter = tsr.router<typeof userContract, Context>(
  userContract,
  {
    getUser: async (args) => {
      const user = await db.query.User.findFirst({
        where: eq(User.username, args.params.username),
      });

      return {
        status: 201,
        body: user,
      };
    },
  }
);
