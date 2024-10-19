import { extendZodWithOpenApi } from "@anatine/zod-openapi";
import {
  KnowledgeConnectionMetadataSchema,
  KnowledgeConnectionTypes,
  KnowledgeQueryTypes,
  KnowledgeTypes,
  SelectKnowledgeSchema,
} from "@sovoli/db/schema";
import { initContract } from "@ts-rest/core";
import { z } from "zod";

extendZodWithOpenApi(z);

// #region Shared Schemas

// Base schema for connections without connectionId (used for creating connections)
const BaseConnectionSchema = z.object({
  notes: z
    .string()
    .optional()
    .openapi({
      description:
        "Additional notes in markdown format about the connection such as why it was recommended or added to the collection.",
      examples: [
        `This book explores the concept of mortality and how it influences human behavior. It aligns with the existential themes present on the shelf and provides a psychological perspective on how people cope with the knowledge of death.
      
      ## Learning outcomes:
      
      - What psychological mechanisms do people use to deny death?
      - How does the fear of death influence human culture and behavior?
      `,
      ],
    }),
  order: z.number().optional(),
  type: z.enum(KnowledgeConnectionTypes).openapi({
    description: `
      'Contains' means that the knowledge is a part of the target knowledge such as a book shelf or collection.
      'Recommends' means that the knowledge is recommended to the user based on their preferences.
      'Refers' means that the knowledge is a reference to the target knowledge, such as a book review or a blog post.
    `,
  }),

  metadata: KnowledgeConnectionMetadataSchema.optional(),

  targetKnowledge: z.object({
    query: z.string().openapi({
      description:
        "The query is used to search for the book. If the book is already in your knowledge library, it will be linked. Format: `{title} {author}`",
      examples: ["The Interpretation of Dreams Sigmung Freud"],
    }),
    queryType: z.enum(KnowledgeQueryTypes),
    type: z.enum(KnowledgeTypes),
  }),
});

const BaseUpsertKnowledgeSchemaRequest = z.object({
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
        "This object is meant for ChatGPT to send files related to the knowledge, such as images, PDFs, etc. For images, the recommended resolution is 1600x900, 16:9 ratio.",
    }),

  title: z.string(),
  description: z.string(),
  content: z.string().openapi({
    description:
      "This field holds the highlighted text in Markdown format. It supports Github Flavored Markdown",
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

  iaPrivate: z.boolean().optional().default(false),
});

const BaseUpsertKnowledgeSchemaResponse = SelectKnowledgeSchema.extend({
  url: z.string().url(),
});

// #endregion

// #region POST /knowledge Schamas
const PostConnectionSchema = BaseConnectionSchema;
export type PostConnectionSchema = z.infer<typeof PostConnectionSchema>;

const PostKnowledgeSchemaRequest = BaseUpsertKnowledgeSchemaRequest.extend({
  connections: PostConnectionSchema.array().optional(),
});

const PostKnowledgeSchemaResponse = BaseUpsertKnowledgeSchemaResponse.extend({
  authToken: z.string().openapi({
    description:
      "This token is recieved from the POST /knowledge endpoint and is mandatory to update the knowledge when the knowledge was created by a bot such as ChatGPT.",
  }),
});

export type PostKnowledgeSchemaRequest = z.infer<
  typeof PostKnowledgeSchemaRequest
>;

// #endregion

// #region PUT /knowledge/:id Schamas
export const UpdateConnectionSchema = BaseConnectionSchema.partial().extend({
  action: z.literal("update"),
  id: z.string().openapi({
    description:
      "The unique ID of the connection, required for updates. If this is omitted, the connection will be created.",
  }),
});
export type UpdateConnectionSchema = z.infer<typeof UpdateConnectionSchema>;

const AddConnectionSchema = BaseConnectionSchema.extend({
  action: z.literal("add"),
});
const RemoveConnectionSchema = z.object({
  action: z.literal("remove"),
  id: z.string().openapi({
    description:
      "The unique ID of the connection to remove. This is required for deleting a connection.",
  }),
});

const PutConnectionSchema = z.discriminatedUnion("action", [
  UpdateConnectionSchema,
  AddConnectionSchema,
  RemoveConnectionSchema,
]);

const PutKnowledgeSchemaRequest =
  BaseUpsertKnowledgeSchemaRequest.partial().extend({
    connections: PutConnectionSchema.array().optional(),
    authToken: z.string().optional().openapi({
      description:
        "This token is mandatory for updates if the knowledge was created by a bot such as ChatGPT.",
    }),

    assets: z
      .array(
        z.object({
          id: z.string().openapi({
            description:
              "The unique ID of the media asset to remove. This is required for deleting a media asset.",
          }),
          action: z.literal("remove"),
        }),
      )
      .optional(),
  });

const PutKnowledgeSchemaResponse = BaseUpsertKnowledgeSchemaResponse;

export type PutKnowledgeSchemaRequest = z.infer<
  typeof PutKnowledgeSchemaRequest
>;

// #endregion

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
    putKnowledge: {
      method: "PUT",
      path: `/:id`,
      pathParams: z.object({
        id: z.coerce.string(),
      }),
      body: PutKnowledgeSchemaRequest,
      responses: {
        200: PutKnowledgeSchemaResponse,
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
