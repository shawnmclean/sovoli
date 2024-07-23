import { tsr } from "@ts-rest/serverless/next";
import { eq } from "@sovoli/db";
import { users } from "@sovoli/db/schema";
import { db } from "@sovoli/db/client";

import { userContract } from "./userContract";

export const userRouter = tsr.router(userContract, {
  getUser: async (args) => {
    const user = await db.query.users.findFirst({
      where: eq(users.username, args.params.username),
    });

    return {
      status: 201,
      body: user,
    };
  },
});
