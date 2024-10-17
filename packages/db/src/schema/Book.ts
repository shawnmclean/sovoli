import type { InferInsertModel, InferSelectModel, SQL } from "drizzle-orm";
import { sql } from "drizzle-orm";
import {
  date,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  unique,
  uuid,
  varchar,
  vector,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { tsVector } from "../utils";

export const Author = pgTable("author", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  // open library id
  olid: varchar("olid", { length: 20 }).unique(),

  name: varchar("name", { length: 255 }).notNull(),
  fullName: varchar("full_name", { length: 255 }),
  bio: text("bio"),
  alternateNames: varchar("alternate_names", { length: 255 }).array(),
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

export const SelectAuthorSchema = createSelectSchema(Author, {
  alternateNames: z.array(z.string()).optional(),
});
export const InsertAuthorSchema = createInsertSchema(Author, {
  alternateNames: z.array(z.string()).optional(),
});
export type SelectAuthorSchema = z.infer<typeof SelectAuthorSchema>;
export type InsertAuthorSchema = z.infer<typeof InsertAuthorSchema>;

export const BookCoverSchema = z.object({
  small: z.string().nullish(),
  medium: z.string().nullish(),
  large: z.string().nullish(),
});

export type BookCover = z.infer<typeof BookCoverSchema>;

export const BookDimensionsSchema = z.object({
  length: z.object({
    unit: z.string(),
    value: z.number(),
  }),
  width: z.object({
    unit: z.string(),
    value: z.number(),
  }),
  height: z.object({
    unit: z.string(),
    value: z.number(),
  }),
  weight: z.object({
    unit: z.string(),
  }),
});
export type BookDimensions = z.infer<typeof BookDimensionsSchema>;

export const OtherISBNSchema = z.object({
  isbn: z.string(),
  binding: z.string(),
});
export type OtherISBN = z.infer<typeof OtherISBNSchema>;

export const Book = pgTable(
  "book",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),

    // stores both ISBN-13 and ISBN-10
    isbn13: varchar("isbn_13", { length: 13 }).unique(),
    isbn10: varchar("isbn_10", { length: 10 }).unique(),

    // google book id
    googleId: varchar("google_id", { length: 20 }).unique(),

    // open library id
    olid: varchar("olid", { length: 20 }).unique(),
    // amazon asin
    asin: varchar("asin", { length: 20 }).unique(),

    title: text("title").notNull(),
    longTitle: text("long_title"),
    language: varchar("language", { length: 7 }),
    image: text("image"),
    dimensions: text("dimensions"),
    structuredDimensions: jsonb(
      "structured_dimensions",
    ).$type<BookDimensions>(),
    pageCount: integer("page_count").default(0),
    subjects: text("subjects")
      .array()
      .$type<string[]>()
      .notNull()
      .default(sql`'{}'::text[]`),
    authors: text("authors")
      .array()
      .$type<string[]>()
      .notNull()
      .default(sql`'{}'::text[]`),
    publishedDate: date("published_date"),
    publisher: varchar("publisher", { length: 255 }),
    binding: text("binding"),
    otherISBNs: jsonb("other_isbns").$type<OtherISBN[]>(),

    description: text("description"),

    subtitle: varchar("subtitle", { length: 255 }),
    editions: varchar("editions", { length: 255 }),

    // slug will be in the form of {title}-{isbn}
    slug: varchar("slug", { length: 255 }).unique(),

    cover: jsonb("cover").$type<BookCover>(),

    // The following fields are only used for the inference system
    triggerDevId: varchar("trigger_dev_id", { length: 255 }),
    lastISBNdbUpdated: date("last_isbndb_updated"),

    inferrenceError: text("inferrence_error"),
    lastGoogleUpdated: date("last_google_updated"),
    lastOLUpdated: date("last_ol_updated"),
    inferredAuthor: text("inferred_author"),

    createdAt: date("created_at").notNull().defaultNow(),
    updatedAt: date("updated_at").notNull().defaultNow(),

    search: tsVector("search").generatedAlwaysAs(
      (): SQL =>
        sql`to_tsvector('english', ${Book.title} || ' ' || immutable_array_to_string(${Book.authors}, ' '))`,
    ),
  },
  (table) => {
    return {
      isbnCompositeUnique: unique("unique_isbn_composite").on(
        table.isbn10,
        table.isbn13,
      ),
      searchIndex: index("idx_search").using("gin", table.search),
    };
  },
);

export const SelectBookSchema = createSelectSchema(Book).extend({
  authors: z.array(SelectAuthorSchema).optional(),
  cover: BookCoverSchema.nullish(),
});
export const InsertBookSchema = createInsertSchema(Book);

export type SelectBookSchema = z.infer<typeof SelectBookSchema>;
export type InsertBookSchema = z.infer<typeof InsertBookSchema>;

export type SelectBook = InferSelectModel<typeof Book>;

export type InsertBook = InferInsertModel<typeof Book>;

export const BookEmbedding = pgTable(
  "book_embedding",
  {
    bookId: uuid("book_id")
      .primaryKey()
      .references(() => Book.id),
    // 1536 is default size for openai embeddings
    openAIEmbedding: vector("open_ai_embedding", { dimensions: 1536 }),
    openAIEmbeddingUpdated: date("open_ai_embedding_updated")
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    // Use HNSW indexing with vector_cosine_ops for optimal search performance with OpenAI embeddings
    openAIEmbeddingIndex: index("open_ai_embedding_index").using(
      "hnsw",
      table.openAIEmbedding.op("vector_cosine_ops"),
    ),
  }),
);

export const AuthorToBook = pgTable(
  "author_to_book",
  {
    bookId: uuid("book_id")
      .notNull()
      .references(() => Book.id),
    authorId: uuid("author_id")
      .notNull()
      .references(() => Author.id),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.bookId, table.authorId],
    }),
  }),
);

export const InsertAuthorToBookSchema = createInsertSchema(AuthorToBook);
export type InsertAuthorToBookSchema = z.infer<typeof InsertAuthorToBookSchema>;
