import { SelectUserSchema } from "@sovoli/db/schema";
import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

export const userContract = c.router({
  getUser: {
    method: "GET",
    path: `/user`,
    responses: {
      200: z.object({
        name: z.string(),
      }),
    },
    summary: "Get a user by username",
  },
});
