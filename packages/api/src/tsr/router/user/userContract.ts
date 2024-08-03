import { z } from "zod";
import { initContract } from "@ts-rest/core";
import { schema } from "@sovoli/db";
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
      200: schema.SelectUserSchema.nullable(),
      404: ZUnsuccessfulResponseSchema,
    },
    summary: "Get a user by username",
  },
});
