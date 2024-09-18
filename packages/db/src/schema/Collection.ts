import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { KnowledgeResource } from "./KnowledgeResource";
import { User } from "./User";

export const Collection = pgTable(
  "collection",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    // usually follows the title of the book
    name: varchar("name", { length: 255 }),
    description: text("description"),
    userId: uuid("user_id")
      .notNull()
      .references(() => User.id),

    slug: varchar("slug", { length: 255 }),

    // these collections are created when a user is created, they can never be deleted
    isDefault: boolean("is_default").notNull().default(false),

    isPrivate: boolean("is_public").notNull().default(false),

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

export const CollectionItem = pgTable("collection_item", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),

  collectionId: uuid("collection_id")
    .notNull()
    .references(() => Collection.id),
  knowledgeResourceId: uuid("knowledge_resource_id")
    .notNull()
    .references(() => KnowledgeResource.id),

  // optional ordering for the items in the collection (useful for study guides or arranging books on a shelf)
  order: integer("order"),

  notes: text("notes"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
