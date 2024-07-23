import { z } from "zod";
import { initContract } from "@ts-rest/core";
import { SelectUserSchema } from "@sovoli/db/schema";

const c = initContract();

export const userContract = c.router({
  getUser: {
    method: "GET",
    path: `/users/:username`,
    pathParams: z.object({
      username: z.coerce.string(),
    }),
    responses: {
      200: SelectUserSchema.nullable(),
    },
    summary: "Get a user by username",
  },
});
