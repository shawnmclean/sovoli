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
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { Book } from "./Book";
import { User } from "./User";

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
      .references(() => User.id),
    shelfOrder: integer("shelf_order"),
    verifiedDate: date("verified_date"),

    // the query that was used to search for the book
    query: varchar("query", { length: 255 }),
    queryError: jsonb("query_error").$type<MyBookHydrationErrorSchema>(),

    bookId: uuid("book_id").references(() => Book.id),
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
