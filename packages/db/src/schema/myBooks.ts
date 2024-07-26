import { relations } from "drizzle-orm";
import { integer, pgTable, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./identity";
import { shelves } from "./furnitures";
import { createSelectSchema } from "drizzle-zod";

export const books = pgTable("books", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  isbn: varchar("isbn", { length: 255 }).notNull().unique(),
  // lets not add a slug for now until we have a better idea of how to handle it: https://chatgpt.com/share/7cea2ff0-4534-40b1-ba17-c0df16edfec7
  // slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }),
});

export const SelectBookSchema = createSelectSchema(books);

export const booksRelations = relations(books, ({ many }) => ({
  myBooks: many(myBooks),
}));

export const myBooks = pgTable(
  "myBooks",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 255 }).notNull(),
    // usually follows the title of the book
    name: varchar("name", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }),
    ownerId: uuid("ownerId")
      .notNull()
      .references(() => users.id),
    shelfId: uuid("shelfId").references(() => shelves.id),
    shelfOrder: integer("shelfOrder"),
    bookId: uuid("bookId")
      .references(() => books.id)
      .notNull(),
  },
  (table) => ({
    uniqueSlug: unique().on(table.ownerId, table.slug),
  })
);

export const SelectMyBookSchema = createSelectSchema(myBooks);

export const myBooksRelations = relations(myBooks, ({ one }) => ({
  owner: one(users, {
    fields: [myBooks.ownerId],
    references: [users.id],
  }),
  shelf: one(shelves, {
    fields: [myBooks.shelfId],
    references: [shelves.id],
  }),
  book: one(books, {
    fields: [myBooks.bookId],
    references: [books.id],
  }),
}));
