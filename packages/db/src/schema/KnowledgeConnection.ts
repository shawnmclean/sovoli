import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { Knowledge, SelectKnowledgeSchema } from "./Knowledge";

export const KnowledgeConnection = pgTable("knowledge_connection", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),

  sourceKnowledgeId: uuid("source_knowledge_id")
    .notNull()
    .references(() => Knowledge.id, { onDelete: "cascade" }),
  targetKnowledgeId: uuid("target_knowledge_id")
    .notNull()
    .references(() => Knowledge.id, { onDelete: "cascade" }),

  // optional ordering for the items in the collection (useful for study guides or arranging books on a shelf)
  order: integer("order"),

  notes: text("notes"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

const baseSelectKnowledgeConnectionSchema =
  createSelectSchema(KnowledgeConnection);

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

export const InsertKnowledgeConnectionSchema =
  createInsertSchema(KnowledgeConnection);
export type InsertKnowledgeConnectionSchema = z.infer<
  typeof InsertKnowledgeConnectionSchema
>;
