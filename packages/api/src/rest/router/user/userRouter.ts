import { tsr } from "@ts-rest/serverless/next";
import { eq } from "@sovoli/db";

import { db, schema } from "@sovoli/db";

import { userContract } from "./userContract";

export const userRouter = tsr.router(userContract, {
  getUser: async ({ params: { username } }) => {
    const user = await db.query.users.findFirst({
      where: eq(schema.users.username, username),
    });

    // if (!user) return { status: 404 };

    return {
      status: 200,
      body: schema.SelectUserSchema.parse(user),
    };
  },
});
