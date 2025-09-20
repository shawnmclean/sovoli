import {
  KnowledgeConnectionMetadataSchema,
  KnowledgeConnectionTypes,
  KnowledgeQueryTypes,
  KnowledgeTypes,
  SelectKnowledgeSchema,
} from "@sovoli/db/schema";
import { z } from "zod";

// #region Shared Schemas

// Base schema for connections without connectionId (used for creating connections)
const BaseConnectionSchema = z.object({
  notes: z.string().optional(),
  order: z.number().optional(),
  type: z.enum(KnowledgeConnectionTypes),

  metadata: KnowledgeConnectionMetadataSchema.optional(),

  targetKnowledge: z.object({
    query: z.string(),
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
        download_link: z.string(),
      }),
    )
    .optional(),

  title: z.string(),
  description: z.string(),
  content: z.string(),

  // New context field to hold non-highlighted text
  context: z.string().optional(),

  // A description of what the context represents
  contextDescription: z.string().optional(),
  type: z.enum(KnowledgeTypes),

  iaPrivate: z.boolean().optional().default(false),
});

const BaseUpsertKnowledgeSchemaResponse = SelectKnowledgeSchema;

// #endregion

// #region POST /knowledge Schamas
const PostConnectionSchema = BaseConnectionSchema;
export type PostConnectionSchema = z.infer<typeof PostConnectionSchema>;

export const PostKnowledgeSchemaRequest =
  BaseUpsertKnowledgeSchemaRequest.extend({
    connections: PostConnectionSchema.array().optional(),
  });

export type PostKnowledgeSchemaRequest = z.infer<
  typeof PostKnowledgeSchemaRequest
>;

// #endregion

// #region PUT /knowledge/:id Schamas
export const UpdateConnectionSchema = BaseConnectionSchema.partial().extend({
  action: z.literal("update"),
  id: z.string(),
});
export type UpdateConnectionSchema = z.infer<typeof UpdateConnectionSchema>;

const AddConnectionSchema = BaseConnectionSchema.extend({
  action: z.literal("add"),
});
const RemoveConnectionSchema = z.object({
  action: z.literal("remove"),
  id: z.string(),
});

const PutConnectionSchema = z.discriminatedUnion("action", [
  UpdateConnectionSchema,
  AddConnectionSchema,
  RemoveConnectionSchema,
]);

export const PutKnowledgeSchemaRequest =
  BaseUpsertKnowledgeSchemaRequest.partial().extend({
    connections: PutConnectionSchema.array().optional(),
    authToken: z.string().optional(),

    assets: z
      .array(
        z.object({
          id: z.string(),
          action: z.literal("remove"),
        }),
      )
      .optional(),
  });

export const PutKnowledgeSchemaResponse = BaseUpsertKnowledgeSchemaResponse;

export type PutKnowledgeSchemaRequest = z.infer<
  typeof PutKnowledgeSchemaRequest
>;

// #endregion
