import {
  boolean,
  date,
  integer,
  pgTable,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { KnowledgeResource } from "./KnowledgeResource";
import { User } from "./User";

export const Collection = pgTable("collection", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  // usually follows the title of the book
  name: varchar("name", { length: 255 }),
  description: text("description"),
  userId: uuid("user_id")
    .notNull()
    .references(() => User.id),

  // these collections are created when a user is created, they can never be deleted
  isDefault: boolean("is_default").notNull().default(false),

  isPublic: boolean("is_public").notNull().default(false),

  createdAt: date("created_at").notNull().defaultNow(),
  updatedAt: date("updated_at").notNull().defaultNow(),
});

export const CollectionItem = pgTable("collection_item", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),

  collectionId: uuid("collection_id")
    .notNull()
    .references(() => Collection.id),
  knowledgeResourceId: uuid("knowledge_resource_id").references(
    () => KnowledgeResource.id,
  ),

  // optional ordering for the items in the collection (useful for study guides or arranging books on a shelf)
  order: integer("order"),

  notes: text("notes"),

  createdAt: date("created_at").notNull().defaultNow(),
  updatedAt: date("updated_at").notNull().defaultNow(),
});
