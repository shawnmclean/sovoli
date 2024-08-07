import { db, eq, schema } from "@sovoli/db";
import { SelectUserSchema } from "@sovoli/db/schema";
import { tsr } from "@ts-rest/serverless/next";

import { userContract } from "./userContract";

export const userRouter = tsr.router(userContract, {
  getUser: async ({ params: { username } }) => {
    const user = await db.query.users.findFirst({
      where: eq(schema.users.username, username),
    });

    if (!user) return { status: 404, body: { message: "User not found" } };

    return {
      status: 200,
      body: SelectUserSchema.parse(user),
    };
  },
});
