import { relations } from "drizzle-orm";
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./identity";
import { shelves } from "./furnitures";

export const myBooks = pgTable("myBooks", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }),
  ownerId: uuid("ownerId")
    .notNull()
    .references(() => users.id),
  shelfId: uuid("shelfId").references(() => shelves.id),
});

export const myBooksRelations = relations(myBooks, ({ one }) => ({
  owner: one(users, {
    fields: [myBooks.ownerId],
    references: [users.id],
  }),
  shelve: one(shelves),
}));
