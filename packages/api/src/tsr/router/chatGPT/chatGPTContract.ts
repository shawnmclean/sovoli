import { extendZodWithOpenApi } from "@anatine/zod-openapi";
import { initContract } from "@ts-rest/core";
import { z } from "zod";

extendZodWithOpenApi(z);

const c = initContract();

export const chatGPTContract = c.router(
  {
    createResearchCollection: {
      method: "POST",
      path: `/research-collection`,
      body: z.object({
        openaiFileIdRefs: z.array(
          z.object({
            name: z.string(),
            id: z.string(),
            mime_type: z.string(),
            download_link: z.string(),
          }),
        ),
        books: z.array(
          z.object({
            name: z.string(),
          }),
        ),
      }),
      responses: {
        200: z.object({
          items: z.array(
            z.object({
              name: z.string(),
              download_link: z.string(),
            }),
          ),
          books: z.array(
            z.object({
              name: z.string(),
            }),
          ),
        }),
      },
      summary: "Create a Research Collection",
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
    pathPrefix: "/chatgpt",
    commonResponses: {
      401: c.type<{ message: "Unauthorized" }>(),
    },
  },
);
