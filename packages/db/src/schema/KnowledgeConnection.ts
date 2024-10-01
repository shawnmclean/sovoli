import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { createEnumObject } from "../utils";
import { Knowledge, SelectKnowledgeSchema } from "./Knowledge";

export const KnowledgeConnectionTypes = [
  "Contains",
  "Recommends",
  "Refers",
] as const;
export const KnowledgeConnectionType = createEnumObject(
  KnowledgeConnectionTypes,
);
export const knowledgeConnectionTypeEnum = pgEnum(
  "knowledge_collection_type",
  KnowledgeConnectionTypes,
);

export const KnowledgeConnectionMetadataSchema = z.object({
  page: z.number().optional(),
  chapter: z.number().optional(),
});

export type KnowledgeConnectionMetadataSchema = z.infer<
  typeof KnowledgeConnectionMetadataSchema
>;

export const KnowledgeConnection = pgTable("knowledge_connection", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),

  sourceKnowledgeId: uuid("source_knowledge_id")
    .notNull()
    .references(() => Knowledge.id, { onDelete: "cascade" }),
  targetKnowledgeId: uuid("target_knowledge_id")
    .notNull()
    .references(() => Knowledge.id, { onDelete: "cascade" }),

  type: knowledgeConnectionTypeEnum("type")
    .notNull()
    .default(KnowledgeConnectionType.Contains),

  // optional ordering for the items in the collection (useful for study guides or arranging books on a shelf)
  order: integer("order"),

  notes: text("notes"),

  metadata: jsonb("metadata").$type<KnowledgeConnectionMetadataSchema>(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

const baseSelectKnowledgeConnectionSchema = createSelectSchema(
  KnowledgeConnection,
  {
    metadata: KnowledgeConnectionMetadataSchema,
  },
);

export type KnowledgeConnection = z.infer<
  typeof baseSelectKnowledgeConnectionSchema
> & {
  SourceKnowledge?: SelectKnowledgeSchema | null;
  TargetKnowledge?: SelectKnowledgeSchema | null;
};

// Recursive schema for KnowledgeConnection with type hint
export const SelectKnowledgeConnectionSchema: z.ZodType<KnowledgeConnection> =
  baseSelectKnowledgeConnectionSchema.extend({
    SourceKnowledge: z.lazy(() => SelectKnowledgeSchema.nullish()), // Lazy recursion for source knowledge
    TargetKnowledge: z.lazy(() => SelectKnowledgeSchema.nullish()), // Lazy recursion for target knowledge
  });

export type SelectKnowledgeConnectionSchema = z.infer<
  typeof SelectKnowledgeConnectionSchema
>;

export const InsertKnowledgeConnectionSchema = createInsertSchema(
  KnowledgeConnection,
  {
    metadata: KnowledgeConnectionMetadataSchema,
  },
);
export type InsertKnowledgeConnectionSchema = z.infer<
  typeof InsertKnowledgeConnectionSchema
>;
