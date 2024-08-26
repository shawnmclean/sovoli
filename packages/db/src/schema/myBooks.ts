import {
  date,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  // primaryKey,
  text,
  unique,
  uniqueIndex,
  uuid,
  varchar,
  vector,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { shelves } from "./furnitures";
import { users } from "./identity";

export const authors = pgTable("author", {
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

export const SelectAuthorSchema = createSelectSchema(authors);
export const InsertAuthorSchema = createInsertSchema(authors);
export type SelectAuthorSchema = z.infer<typeof SelectAuthorSchema>;
export type InsertAuthorSchema = z.infer<typeof InsertBookSchema>;

export const BookCoverSchema = z.object({
  small: z.string().nullish(),
  medium: z.string().nullish(),
  large: z.string().nullish(),
});

export type BookCover = z.infer<typeof BookCoverSchema>;

export const books = pgTable(
  "book",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),

    // stores both ISBN-13 and ISBN-10
    isbn13: varchar("isbn_13", { length: 13 }).unique(),
    isbn10: varchar("isbn_10", { length: 10 }).unique(),

    // open library id
    olid: varchar("olid", { length: 20 }).unique(),
    // amazon asin
    asin: varchar("asin", { length: 20 }).unique(),

    title: varchar("title", { length: 255 }).notNull(),
    subtitle: varchar("subtitle", { length: 255 }),
    editions: varchar("editions", { length: 255 }),

    // slug will be in the form of {title}-{author}-{isbn}
    slug: varchar("slug", { length: 255 }).unique(),

    publishedDate: date("published_date"),
    publisher: varchar("publisher", { length: 255 }),
    pageCount: integer("page_count").default(0),
    description: text("description"),
    language: varchar("language", { length: 7 }),
    cover: jsonb("cover").$type<BookCover>(),

    // The following fields are only used for the inference system
    triggerDevId: varchar("trigger_dev_id", { length: 255 }),
    inferrenceError: text("inferrence_error"),
    lastGoogleUpdated: date("last_google_updated"),
    lastOLUpdated: date("last_ol_updated"),
    inferredAuthor: varchar("inferred_author", { length: 255 }),

    createdAt: date("created_at").notNull().defaultNow(),
    updatedAt: date("updated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      // Composite unique index to ensure no duplicate combinations of isbn13, isbn10, olid, and slug, while
      // ensuring that the database supports null behavior but not null uniqueness
      compositeUniqueIndex: unique("unique_book_composite")
        .on(table.isbn13, table.isbn10, table.asin, table.olid, table.slug)
        .nullsNotDistinct(),
      slugIndex: uniqueIndex("unique_book_slug").on(table.slug),
    };
  },
);

export const bookEmbeddings = pgTable(
  "book_embedding",
  {
    bookId: uuid("book_id")
      .primaryKey()
      .references(() => books.id),
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

export const authorsToBooks = pgTable(
  "authors_to_books",
  {
    bookId: uuid("book_id")
      .notNull()
      .references(() => books.id),
    authorId: uuid("author_id")
      .notNull()
      .references(() => authors.id),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.bookId, table.authorId],
    }),
  }),
);

export const SelectBookSchema = createSelectSchema(books).extend({
  authors: z.array(SelectAuthorSchema).optional(),
});
export const InsertBookSchema = createInsertSchema(books);
export type SelectBookSchema = z.infer<typeof SelectBookSchema>;
export type InsertBookSchema = z.infer<typeof InsertBookSchema>;

export const MyBookHydrationErrorSchema = z.object({
  message: z.string(),
  triggerDevId: z.string(),
  duplicatedMyBookId: z.string().nullish(),
});

export type MyBookHydrationErrorSchema = z.infer<
  typeof MyBookHydrationErrorSchema
>;

export const myBooks = pgTable(
  "my_book",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    // usually follows the title of the book
    name: varchar("name", { length: 255 }),
    description: text("description"),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => users.id),
    shelfId: uuid("shelf_id").references(() => shelves.id),
    shelfOrder: integer("shelf_order"),
    verifiedDate: date("verified_date"),

    // the query that was used to search for the book
    query: varchar("query", { length: 255 }),
    queryError: jsonb("query_error").$type<MyBookHydrationErrorSchema>(),

    bookId: uuid("book_id").references(() => books.id),
  },
  (table) => ({
    /**
     * only allow a distinct book per owner
     */
    uniqueBook: unique("unique_owner_book").on(table.ownerId, table.bookId),

    uniqueQuery: unique("unique_owner_query").on(table.ownerId, table.query),
  }),
);

export const SelectMyBookSchema = createSelectSchema(myBooks);
export const InsertMyBookSchema = createInsertSchema(myBooks);
export type InsertMyBookSchema = z.infer<typeof InsertMyBookSchema>;
export type SelectMyBookSchema = z.infer<typeof SelectMyBookSchema>;
