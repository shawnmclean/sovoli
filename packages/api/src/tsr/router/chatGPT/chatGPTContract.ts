import { extendZodWithOpenApi } from "@anatine/zod-openapi";
import { initContract } from "@ts-rest/core";
import { z } from "zod";

extendZodWithOpenApi(z);

const c = initContract();

export const chatGPTContract = c.router(
  {
    createBookList: {
      method: "POST",
      path: `/`,
      body: z.object({
        openaiFileIdRefs: z.array(
          z.object({
            name: z.string(),
            id: z.string(),
            mime_type: z.string(),
            download_link: z.string(),
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
        }),
      },
      summary: "Get the currently logged in user",
    },
  },
  {
    pathPrefix: "/chatgpt",
    commonResponses: {
      401: c.type<{ message: "Unauthorized" }>(),
    },
  },
);
