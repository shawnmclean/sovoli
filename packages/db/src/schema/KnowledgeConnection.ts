import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { createEnumObject } from "../utils";
import { Knowledge, SelectKnowledgeSchema } from "./Knowledge";

export const KnowledgeConnectionTypes = [
  "contains",
  "recommends",
  "refers",
  "main_reference",
  "supplemental_reference",
  "comment",
  "collection",
] as const;
export const KnowledgeConnectionType = createEnumObject(
  KnowledgeConnectionTypes,
);
export type KnowledgeConnectionType = (typeof KnowledgeConnectionTypes)[number];
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

export const KnowledgeConnection = pgTable(
  "knowledge_connection",
  {
    id: varchar("id", { length: 256 })
      .notNull()
      .primaryKey()
      .$defaultFn(createId),

    sourceKnowledgeId: varchar("source_knowledge_id", { length: 256 })
      .notNull()
      .references(() => Knowledge.id, { onDelete: "cascade" }),
    targetKnowledgeId: varchar("target_knowledge_id", { length: 256 })
      .notNull()
      .references(() => Knowledge.id, { onDelete: "cascade" }),

    type: knowledgeConnectionTypeEnum("type")
      .notNull()
      .default(KnowledgeConnectionType.collection),

    // optional ordering for the items in the collection (useful for study guides or arranging books on a shelf)
    order: integer("order"),

    notes: text("notes"),

    metadata: jsonb("metadata").$type<KnowledgeConnectionMetadataSchema>(),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    uniqueKnowledgeConnection: unique("unique_knowledge_connection").on(
      table.sourceKnowledgeId,
      table.targetKnowledgeId,
    ),
    uniqueMainReferencePerSource: uniqueIndex(
      "unique_main_reference_per_source",
    )
      .on(table.sourceKnowledgeId)
      .where(
        sql.raw(
          `${table.type.name} = '${KnowledgeConnectionType.main_reference}'`,
        ),
      ),
  }),
);

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
