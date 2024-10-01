import { extendZodWithOpenApi } from "@anatine/zod-openapi";
import {
  KnowledgeConnectionMetadataSchema,
  KnowledgeConnectionTypes,
  KnowledgeTypes,
  SelectKnowledgeSchema,
} from "@sovoli/db/schema";
import { initContract } from "@ts-rest/core";
import { z } from "zod";

extendZodWithOpenApi(z);

const PostKnowledgeSchemaRequest = z.object({
  openaiFileIdRefs: z
    .array(
      z.object({
        name: z.string(),
        id: z.string(),
        mime_type: z.string().nullish(),
        download_link: z.string().url(),
      }),
    )
    .optional()
    .openapi({
      description:
        "This object is meant for ChatGPT to send files related to the knowledge, such as images, PDFs, etc.",
    }),

  title: z.string(),
  description: z.string(),
  content: z.string().openapi({
    description: "This field holds the highlighted text in Markdown format.",
    examples: ["## Important Concept\nThis text was highlighted by the user."],
  }),

  // New context field to hold non-highlighted text
  context: z
    .string()
    .optional()
    .openapi({
      description:
        "This field contains additional text (not highlighted) used as context for AI models.",
      examples: [
        "This is some text that was not highlighted but is still important for context.",
      ],
    }),

  // A description of what the context represents
  contextDescription: z
    .string()
    .optional()
    .openapi({
      description:
        "This field describes the type of text in the context field, e.g., 'Page text', 'Surrounding paragraphs'.",
      examples: ["Full page text"],
    }),
  type: z.enum(KnowledgeTypes),

  connections: z
    .array(
      z.object({
        notes: z.string().openapi({
          description:
            "Additional notes in markdown format about the connection such as why it was recommended or added to the collection.",
        }),
        order: z.number(),
        type: z.enum(KnowledgeConnectionTypes),

        metadata: KnowledgeConnectionMetadataSchema.optional(),

        // object type is structured for inference
        targetKnowledge: z.object({
          query: z.string().openapi({
            description:
              "The query is used to search for the book. If the book is already in your knowledge library, it will be linked. Example: `{title} {author}`",
          }),
          type: z.enum(KnowledgeTypes),
        }),
      }),
    )
    .optional(),
});

const PostKnowledgeSchemaResponse = z.intersection(
  SelectKnowledgeSchema,
  z.object({ url: z.string().url() }),
);

export type PostKnowledgeSchemaRequest = z.infer<
  typeof PostKnowledgeSchemaRequest
>;

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
