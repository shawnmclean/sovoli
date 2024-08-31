import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

export const meContract = c.router({
  getMe: {
    method: "GET",
    path: "/me",
    responses: {
      200: z.object({
        email: z.string(),
      }),
    },
    summary: "Get the authenticated user",
  },
});
