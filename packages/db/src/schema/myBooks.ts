import { relations } from "drizzle-orm";
import {
  integer,
  jsonb,
  pgTable,
  unique,
  uuid,
  varchar,
  date,
  text,
} from "drizzle-orm/pg-core";
import { users } from "./identity";
import { shelves } from "./furnitures";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const books = pgTable("books", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  isbn: varchar("isbn", { length: 13 }).notNull().unique(),
  // lets not add a slug for now until we have a better idea of how to handle it: https://chatgpt.com/share/7cea2ff0-4534-40b1-ba17-c0df16edfec7
  // slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 255 }),
  publishedDate: date("published_date"),
  pageCount: integer("page_count"),
  description: text("description"),
});

export const SelectBookSchema = createSelectSchema(books);

export const booksRelations = relations(books, ({ many }) => ({
  myBooks: many(myBooks),
}));

export const InferredBookSchema = z.object({
  title: z.string(),
  author: z.string().optional(),
  isbn: z.string().optional(),
  error: z.string().optional(),
});

export const InsertInferredBookSchema = InferredBookSchema.omit({
  error: true,
});
export interface InsertInferredBook
  extends z.infer<typeof InsertInferredBookSchema> {}
export interface InferredBook extends z.infer<typeof InferredBookSchema> {}

export const myBooks = pgTable(
  "myBooks",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 255 }).notNull(),
    // usually follows the title of the book
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => users.id),
    shelfId: uuid("shelf_id").references(() => shelves.id),
    shelfOrder: integer("shelf_order"),

    inferredBook: jsonb("inferred_book").$type<InferredBook>(),

    // if bookId is null, that means it needs manual validation from the inferredBook data
    bookId: uuid("book_id").references(() => books.id),
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
