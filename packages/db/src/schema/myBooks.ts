import {
  date,
  integer,
  jsonb,
  pgTable,
  text,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { shelves } from "./furnitures";
import { users } from "./identity";

export const authors = pgTable("authors", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  // open library id
  olid: varchar("olid", { length: 20 }).unique(),

  name: varchar("name", { length: 255 }).notNull(),
  fullName: varchar("full_name", { length: 255 }),
  bio: text("bio"),
  alternateNames: jsonb("alternate_names").$type<string[]>(),
  birthDate: date("birth_date"),
  deathDate: date("death_date"),

  // The following fields are only used for the inference system
  triggerDevId: varchar("trigger_dev_id", { length: 255 }),
  inferrenceError: text("inferrence_error"),
  // we are only updating from openlibrary right now
  lastOLUpdated: date("last_ol_updated"),

  website: varchar("website", { length: 255 }),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 255 }),

  createdAt: date("created_at").notNull().defaultNow(),
  updatedAt: date("updated_at").notNull().defaultNow(),
});

export const BookCoverSchema = z.object({
  small: z.string(),
  medium: z.string(),
  large: z.string(),
});

export type BookCover = z.infer<typeof BookCoverSchema>;

export const books = pgTable("books", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),

  // stores both ISBN-13 and ISBN-10
  isbn13: varchar("isbn_13", { length: 13 }).unique(),
  isbn10: varchar("isbn_10", { length: 10 }).unique(),
  // open library id
  olid: varchar("olid", { length: 20 }).unique(),

  title: varchar("title", { length: 255 }),
  subtitle: varchar("subtitle", { length: 255 }),

  // slug will be in the form of {title}-{author}-{isbn}
  slug: varchar("slug", { length: 255 }).unique(),

  publishedDate: date("published_date"),
  publisher: varchar("publisher", { length: 255 }),
  pageCount: integer("page_count"),
  description: text("description"),
  language: varchar("language", { length: 2 }),
  cover: jsonb("cover").$type<BookCover>(),

  // The following fields are only used for the inference system
  triggerDevId: varchar("trigger_dev_id", { length: 255 }),
  inferrenceError: text("inferrence_error"),
  lastGoogleUpdated: date("last_google_updated"),
  lastOLUpdated: date("last_ol_updated"),
  inferredAuthor: varchar("inferred_author", { length: 255 }),

  createdAt: date("created_at").notNull().defaultNow(),
  updatedAt: date("updated_at").notNull().defaultNow(),
});

export const authorBooks = pgTable("author_books", {
  bookId: uuid("book_id").references(() => books.id),
  authorId: uuid("author_id").references(() => authors.id),
});

export const SelectBookSchema = createSelectSchema(books);
export type SelectBookSchema = z.infer<typeof SelectBookSchema>;

export const myBooks = pgTable(
  "myBooks",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 255 }),
    // usually follows the title of the book
    name: varchar("name", { length: 255 }),
    description: text("description"),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => users.id),
    shelfId: uuid("shelf_id").references(() => shelves.id),
    shelfOrder: integer("shelf_order"),
    verifiedDate: date("verified_date"),

    // TODO: after inference system is done, make this notNull
    bookId: uuid("book_id").references(() => books.id),
  },
  (table) => ({
    uniqueSlug: unique().on(table.ownerId, table.slug),
  }),
);

export const SelectMyBookSchema = createSelectSchema(myBooks);
