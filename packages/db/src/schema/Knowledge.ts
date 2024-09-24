import {
  boolean,
  date,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import type { KnowledgeConnection } from "./KnowledgeConnection";
import { createEnumObject } from "../utils";
import { Book } from "./Book";
import { SelectKnowledgeConnectionSchema } from "./KnowledgeConnection";
import { SelectMediaAssetSchema } from "./MediaAsset";
import { User } from "./User";

export const KnowledgeTypes = ["Collection", "Book", "Note"] as const;
export const KnowledgeType = createEnumObject(KnowledgeTypes);
export const knowledgeTypeEnum = pgEnum("knowledge_type", KnowledgeTypes);
export const Knowledge = pgTable(
  "knowledge",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    // usually follows the title of the book
    title: varchar("name", { length: 255 }),
    description: text("description"),
    userId: uuid("user_id")
      .notNull()
      .references(() => User.id),
    verifiedDate: date("verified_date"),

    // this will hold the thoughts of the knowledge, in markdown format.
    content: text("content"),
    // this will hold additional context for the knowledge such as page text from OCR.
    context: text("context"),
    // thie will describe the context data, such as saying "OCR from page 10 of book "The Great Gatsby""
    contextDescription: text("context_description"),

    // this is true is the knowledge is posted directly and not from a collection
    isOrigin: boolean("is_origin").notNull().default(false),

    slug: varchar("slug", { length: 255 }),
    type: knowledgeTypeEnum("type").notNull().default(KnowledgeType.Book),

    bookId: uuid("book_id").references(() => Book.id),

    chapterNumber: integer("chapter_number"),
    isPrivate: boolean("is_public").notNull().default(false),

    // the query that was used to search for the book
    // this may come in the form of "book: {title}" or "isbn: {isbn}"
    query: varchar("query", { length: 255 }),
    triggerDevId: varchar("trigger_dev_id", { length: 255 }),
    triggerError: text("trigger_error"),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    /**
     * only allow a distinct slug per owner
     */
    uniqueOwnerSlug: unique("unique_owner_slug").on(table.userId, table.slug),
  }),
);

export const BaseKnowledgeSchema = createSelectSchema(Knowledge);
export type BaseKnowledgeSchema = z.infer<typeof BaseKnowledgeSchema>;

// Manually defining Knowledge type to handle recursion
export type SelectKnowledgeSchema = z.infer<typeof BaseKnowledgeSchema> & {
  Connections: KnowledgeConnection[];
  MediaAssets: SelectMediaAssetSchema[];
};

// Recursive schema for Knowledge
export const SelectKnowledgeSchema: z.ZodType<SelectKnowledgeSchema> =
  BaseKnowledgeSchema.extend({
    MediaAssets: z.array(SelectMediaAssetSchema),
    Connections: z.lazy(() => z.array(SelectKnowledgeConnectionSchema)), // Recursive connections
  });

export const InsertKnowledgeSchema = createInsertSchema(Knowledge);
export type InsertKnowledgeSchema = z.infer<typeof InsertKnowledgeSchema>;
