import {
  date,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { Book } from "./Book";
import { User } from "./User";

export const KnowledgeResource = pgTable("knowledge_resource", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  // usually follows the title of the book
  name: varchar("name", { length: 255 }),
  description: text("description"),
  userId: uuid("user_id")
    .notNull()
    .references(() => User.id),
  verifiedDate: date("verified_date"),

  bookId: uuid("book_id").references(() => Book.id),

  chapterNumber: integer("chapter_number"),

  // the query that was used to search for the book
  // this may come in the form of "book: {title}" or "isbn: {isbn}"
  query: varchar("query", { length: 255 }),
  triggerDevId: varchar("trigger_dev_id", { length: 255 }),
  triggerError: text("trigger_error"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
