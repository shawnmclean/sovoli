import { date, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";

import { books } from "./books";
import { users } from "./identity";

export const KnowledgeResource = pgTable("knowledgeResource", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  // usually follows the title of the book
  name: varchar("name", { length: 255 }),
  description: text("description"),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id),
  verifiedDate: date("verifiedDate"),

  bookId: uuid("bookId").references(() => books.id),

  // the query that was used to search for the book
  // this may come in the form of "book: {title}" or "isbn: {isbn}"
  query: varchar("query", { length: 255 }),
  triggerDevId: varchar("triggerDevId", { length: 255 }),
  triggerError: text("triggerError"),

  createdAt: date("createdAt").notNull().defaultNow(),
  updatedAt: date("updatedAt").notNull().defaultNow(),
});
