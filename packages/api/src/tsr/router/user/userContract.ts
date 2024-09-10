import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

export const userContract = c.router(
  {
    me: {
      method: "GET",
      path: `/`,
      responses: {
        200: z.object({
          name: z.string(),
        }),
      },
      summary: "Get the currently logged in user",
    },
    ping: {
      method: "GET",
      path: `/ping`,
      query: z.object({
        message: z.string().optional(),
      }),
      responses: {
        200: z.object({
          message: z.string(),
        }),
      },
    },
  },
  {
    pathPrefix: "/user",
    commonResponses: {
      401: c.type<{ message: "Unauthorized" }>(),
    },
  },
);
