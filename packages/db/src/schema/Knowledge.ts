import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import {
  boolean,
  date,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { createEnumObject } from "../utils";
import { SelectKnowledgeConnectionSchema } from "./KnowledgeConnection";
import type { KnowledgeMediaAsset } from "./KnowledgeMediaAsset";
import { SelectMediaAssetSchema } from "./MediaAsset";
import { SelectUserSchema, User } from "./User";

export const KnowledgeTypes = ["collection", "book", "note", "shelf"] as const;
export const KnowledgeType = createEnumObject(KnowledgeTypes);
export type KnowledgeType = (typeof KnowledgeTypes)[number];
const knowledgeTypeEnum = pgEnum("knowledge_type", KnowledgeTypes);

export const KnowledgeQueryTypes = ["query", "isbn"] as const;
export const KnowledgeQueryType = createEnumObject(KnowledgeQueryTypes);
export type KnowledgeQueryType = (typeof KnowledgeQueryTypes)[number];
const knowledgeQueryTypeEnum = pgEnum(
  "knowledge_query_type",
  KnowledgeQueryTypes,
);

export const Knowledge = pgTable(
  "knowledge",
  {
    id: varchar("id", { length: 256 }).primaryKey().$defaultFn(createId),
    // usually follows the title of the book
    title: varchar("title", { length: 255 }),
    description: text("description"),
    userId: varchar("user_id", { length: 256 })
      .notNull()
      .references(() => User.id, { onDelete: "cascade" }),
    verifiedDate: date("verified_date"),

    // this will hold the thoughts of the knowledge, in markdown format.
    content: text("content"),

    // this is true is the knowledge is posted directly and not from a collection
    isOrigin: boolean("is_origin").notNull().default(false),

    isDraft: boolean("is_draft").notNull().default(true),

    slug: varchar("slug", { length: 255 }),
    type: knowledgeTypeEnum("type").notNull().default(KnowledgeType.note),

    chapterNumber: integer("chapter_number"),
    isPublic: boolean("is_public").notNull().default(true),

    // the query that is used to hydrate the knowledge, whether its a book (search type; isbn/query), article, youtube, etc
    query: text("query"),
    queryType: knowledgeQueryTypeEnum("query_type")
      .notNull()
      .default(KnowledgeQueryType.query),

    // this is used for if the event was triggered by a background job service
    jobId: varchar("job_id", { length: 255 }),
    jobError: text("job_error"),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    /**
     * only allow a distinct slug per owner
     */
    uniqueOwnerSlug: unique("unique_knowledge_user_slug").on(
      table.userId,
      table.slug,
    ),
  }),
);

export type SelectKnowledge = InferSelectModel<typeof Knowledge>;
export type InsertKnowledge = InferInsertModel<typeof Knowledge>;

export const BaseKnowledgeSchema = createSelectSchema(Knowledge);
export type BaseKnowledgeSchema = z.infer<typeof BaseKnowledgeSchema>;

// Manually defining Knowledge type to handle recursion
export type SelectKnowledgeSchema = z.infer<typeof BaseKnowledgeSchema> & {
  User?: SelectUserSchema | null;
  SourceConnections?: SelectKnowledgeConnectionSchema[] | null;
  TargetConnections?: SelectKnowledgeConnectionSchema[] | null;
  MediaAssets?: SelectMediaAssetSchema[] | null;
  KnowledgeMediaAssets?: KnowledgeMediaAsset[] | null;
};

// Recursive schema for Knowledge
export const SelectKnowledgeSchema = BaseKnowledgeSchema.extend({
  User: SelectUserSchema.nullish(),
  MediaAssets: SelectMediaAssetSchema.array().nullish(),
  SourceConnections: z
    .lazy(() => SelectKnowledgeConnectionSchema.array())
    .nullish(), // Recursive connections
  TargetConnections: z
    .lazy(() => SelectKnowledgeConnectionSchema.array())
    .nullish(), // Recursive connections
});

export const InsertKnowledgeSchema = createInsertSchema(Knowledge);
export type InsertKnowledgeSchema = z.infer<typeof InsertKnowledgeSchema>;
