import { SelectUserSchema } from "@sovoli/db/schema";
import { initContract } from "@ts-rest/core";
import { z } from "zod";

import { ZUnsuccessfulResponseSchema } from "../../../schema";

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
      404: ZUnsuccessfulResponseSchema,
    },
    summary: "Get a user by username",
  },
});
