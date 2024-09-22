import { KnowledgeConnectionTypes, KnowledgeTypes } from "@sovoli/db/schema";
import { initContract } from "@ts-rest/core";
import { z } from "zod";

const PostKnowledgeSchemaRequest = z.object({
  openaiFileIdRefs: z
    .array(
      z.object({
        name: z.string(),
        id: z.string(),
        mime_type: z.string(),
        download_link: z.string(),
      }),
    )
    .optional()
    .openapi({
      nullable: true,
      description:
        "This object is meant for ChatGPT to send files related to the knowledge, such as images, PDFs, etc.",
    }),

  title: z.string(),
  description: z.string(),
  content: z.string().openapi({
    description: "This field holds the highlighted text in Markdown format.",
    example: "## Important Concept\nThis text was highlighted by the user.",
  }),

  // New context field to hold non-highlighted text
  context: z.string().optional().openapi({
    description:
      "This field contains additional text (not highlighted) used as context for AI models.",
    example:
      "This is some text that was not highlighted but is still important for context.",
  }),

  // A description of what the context represents
  contextDescription: z.string().optional().openapi({
    description:
      "This field describes the type of text in the context field, e.g., 'Page text', 'Surrounding paragraphs'.",
    example: "Full page text",
  }),
  type: z.enum(KnowledgeTypes),

  connections: z
    .array(
      z.object({
        notes: z.string(),
        order: z.number(),
        type: z.enum(KnowledgeConnectionTypes),

        // object type is structured for inference
        targetKnowledge: z.object({
          query: z.string(),
          type: z.enum(KnowledgeTypes),
        }),
      }),
    )
    .optional(),
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