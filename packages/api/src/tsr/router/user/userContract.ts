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
    upload: {
      method: "POST",
      path: `/upload`,
      contentType: "multipart/form-data",
      // body: c.type<{ thumbnail: File }>(), // <- Use File type in here
      body: z
        .object({
          files: z.array(z.string()).openapi({
            type: "array",
            items: { type: "string", format: "binary" },
          }),
        })
        .nullish()
        .openapi({ nullable: false }),
      responses: {
        200: z.object({
          message: z.string(),
          files: z.array(
            z.object({
              fileSize: z.string(),
              fileName: z.string(),
            }),
          ),
        }),
      },
    },
  },
  {
    pathPrefix: "/user",
    commonResponses: {
      401: c.type<{ message: "Unauthorized" }>(),
    },
    baseHeaders: z.object({
      authorization: z.string(),
    }),
  },
);
