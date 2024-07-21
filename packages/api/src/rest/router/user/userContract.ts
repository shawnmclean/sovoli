import { z } from "zod";
import { initContract } from "@ts-rest/core";
import { UserSchema } from "@sovoli/db/schema";

const c = initContract();

export const userContract = c.router({
  getUser: {
    method: "GET",
    path: `/users/:username`,
    pathParams: z.object({
      username: z.coerce.string(),
    }),
    responses: {
      200: UserSchema.nullable(),
    },
    summary: "Get a user by username",
  },
});
