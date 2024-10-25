import { extendZodWithOpenApi } from "@anatine/zod-openapi";
import { initContract } from "@ts-rest/core";
import { z } from "zod";

extendZodWithOpenApi(z);

const c = initContract();

export const userContract = c.router(
  {
    me: {
      method: "GET",
      path: `/`,
      responses: {
        200: z.object({
          name: z.string().nullish(),
          username: z.string().nullish(),
        }),
      },
      summary: "Get the currently logged in user",
    },
  },
  {
    metadata: {
      openApiSecurity: [
        {
          BearerAuth: [],
        },
      ],
    },
    pathPrefix: "/user",
    commonResponses: {
      401:z.literal("Unauthorized")
    },
  },
);
