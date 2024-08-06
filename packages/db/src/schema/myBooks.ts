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

export const AuthorLinkSchema = z.object({
  title: z.string(),
  value: z.string(),
  type: z.enum(["url", "email", "phone"]),
});

export type AuthorLink = z.infer<typeof AuthorLinkSchema>;

export const RemoteAuthorIdSchema = z.object({
  type: z.enum(["openlibrary", "goodreads", "amazon"]),
  id: z.string(),
});

export type RemoteAuthorId = z.infer<typeof RemoteAuthorIdSchema>;

export const authors = pgTable("authors", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  bio: text("bio"),
  alternateNames: jsonb("alternate_names").$type<string[]>(),
  birthDate: date("birth_date"),
  deathDate: date("death_date"),
  links: jsonb("links").$type<AuthorLink[]>(),
  remoteIds: jsonb("remote_ids").$type<RemoteAuthorId[]>(),
  createdAt: date("created_at").notNull().defaultNow(),
  updatedAt: date("updated_at").notNull().defaultNow(),
});

const ImageTypeEnum = z.enum(["thumbnail", "cover", "illustration"]);

export type ImageType = z.infer<typeof ImageTypeEnum>;

export const BookImageSchema = z.object({
  url: z.string(),
  type: ImageTypeEnum,
});

export type BookImage = z.infer<typeof BookImageSchema>;

export const books = pgTable("books", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  isbn: varchar("isbn", { length: 13 }).notNull().unique(),
  // slug will be in the form of {title}-{author}-{isbn}
  // TODO: populate this, then make it notNull()
  slug: varchar("slug", { length: 255 }).unique(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 255 }),
  publishedDate: date("published_date"),
  publisher: varchar("publisher", { length: 255 }),
  pageCount: integer("page_count"),
  description: text("description"),
  language: varchar("language", { length: 2 }),
  images: jsonb("images").$type<BookImage[]>(),
});

export const authorBooks = pgTable("author_books", {
  bookId: uuid("book_id").references(() => books.id),
  authorId: uuid("author_id").references(() => authors.id),
});

export const SelectBookSchema = createSelectSchema(books);

export const InferredBookSchema = z.object({
  title: z.string(),
  author: z.string().optional(),
  isbn: z.string().optional(),
  error: z.string().optional(),
});

export const InsertInferredBookSchema = InferredBookSchema.omit({
  error: true,
});
export type InsertInferredBook = z.infer<typeof InsertInferredBookSchema>;
export type InferredBook = z.infer<typeof InferredBookSchema>;

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
  }),
);

export const SelectMyBookSchema = createSelectSchema(myBooks);
