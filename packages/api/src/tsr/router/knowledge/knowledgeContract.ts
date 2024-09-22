import { initContract } from "@ts-rest/core";
import { z } from "zod";

const PostKnowledgeSchemaRequest = z.object({
  openaiFileIdRefs: z.array(
    z.object({
      name: z.string(),
      id: z.string(),
      mime_type: z.string(),
      download_link: z.string(),
    }),
  ),
});

const PostKnowledgeSchemaResponse = z.object({
  username: z.string().nullish(),
  name: z.string().nullish(),
});

const c = initContract();

export const knowledgeContract = c.router(
  {
    postKnowledge: {
      method: "POST",
      path: `/`,
      body: PostKnowledgeSchemaRequest,
      responses: {
        200: PostKnowledgeSchemaResponse,
      },
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
    pathPrefix: "/knowledge",
    commonResponses: {
      401: c.type<{ message: "Unauthorized" }>(),
    },
  },
);
