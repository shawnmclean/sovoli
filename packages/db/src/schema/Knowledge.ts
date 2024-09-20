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

import { createEnumObject } from "../utils";
import { Book } from "./Book";
import { MediaAsset } from "./MediaAsset";
import { User } from "./User";

const KnowledgeTypes = ["Collection", "Book", "Note"] as const;
export const KnowledgeType = createEnumObject(KnowledgeTypes);
export const knowledgeTypeEnum = pgEnum("knowledge_type", KnowledgeTypes);
export const Knowledge = pgTable(
  "knowledge",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    // usually follows the title of the book
    name: varchar("name", { length: 255 }),
    description: text("description"),
    userId: uuid("user_id")
      .notNull()
      .references(() => User.id),
    verifiedDate: date("verified_date"),

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

export const KnowledgeMediaAsset = pgTable("knowledge_media_asset", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  knowledgeId: uuid("knowledge_id")
    .notNull()
    .references(() => Knowledge.id, { onDelete: "cascade" }),
  mediaAssetId: uuid("media_asset_id")
    .notNull()
    .references(() => MediaAsset.id, { onDelete: "cascade" }),
});
