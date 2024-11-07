import type { InferInsertModel, InferSelectModel, SQL } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import {
  date,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { tsVector } from "../utils";

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
    id: varchar("id", { length: 256 }).primaryKey().$defaultFn(createId),

    // stores both ISBN-13 and ISBN-10
    isbn13: varchar("isbn_13", { length: 15 }).unique(),
    isbn10: varchar("isbn_10", { length: 15 }).unique(),

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
    publisher: text("publisher"),
    binding: text("binding"),
    otherISBNs: jsonb("other_isbns").$type<OtherISBN[]>(),

    description: text("description"),

    subtitle: text("subtitle"),
    editions: varchar("editions", { length: 255 }),

    // slug will be in the form of {title}-{isbn}
    slug: varchar("slug", { length: 255 }).unique(),

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

export const SelectBookSchema = createSelectSchema(Book);
export const InsertBookSchema = createInsertSchema(Book);

export type SelectBookSchema = z.infer<typeof SelectBookSchema>;
export type InsertBookSchema = z.infer<typeof InsertBookSchema>;

export type SelectBook = InferSelectModel<typeof Book>;

export type InsertBook = InferInsertModel<typeof Book>;
