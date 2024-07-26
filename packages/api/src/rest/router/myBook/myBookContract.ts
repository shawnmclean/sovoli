import { z } from "zod";
import { initContract } from "@ts-rest/core";
import { schema } from "@sovoli/db";

const c = initContract();

export const myBookContract = c.router({
  getMyBook: {
    method: "GET",
    path: `/users/:username/mybooks/:slug`,
    pathParams: z.object({
      username: z.coerce.string(),
      slug: z.coerce.string(),
    }),
    responses: {
      200: schema.SelectMyBookSchema.nullable(),
    },
    summary: "Get the user's book by slug",
  },
});
