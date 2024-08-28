import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

export const identityContract = c.router({
  // Get Authenticated User
  profile: {
    method: "GET",
    path: "/user",
    query: z.object({
      name: z.string().optional(),
    }),
    responses: {
      200: z.object({
        message: z.string(),
      }),
    },
    summary: "Get the authenticated user",
  },
});
