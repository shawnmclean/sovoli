import { relations } from "drizzle-orm";
import { pgTable, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./identity";
import { books, myBooks, SelectMyBookSchema } from "./myBooks";
import { z } from "zod";
import { createSelectSchema } from "drizzle-zod";

export const furnitures = pgTable(
  "furniture",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }),
    ownerId: uuid("ownerId")
      .notNull()
      .references(() => users.id),
  },
  (table) => ({
    uniqueSlug: unique().on(table.ownerId, table.slug),
  })
);

export const SelectFurnitureSchema = createSelectSchema(furnitures);

export const furnituresRelations = relations(furnitures, ({ one, many }) => ({
  owner: one(users, {
    fields: [furnitures.ownerId],
    references: [users.id],
  }),
  shelves: many(shelves),
}));

export const shelves = pgTable(
  "shelf",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }),
    furnitureId: uuid("furnitureId")
      .notNull()
      .references(() => furnitures.id),
    ownerId: uuid("ownerId")
      .notNull()
      .references(() => users.id),
  },
  (table) => ({
    uniqueSlug: unique().on(table.ownerId, table.slug),
  })
);

export const SelectShelfSchema = createSelectSchema(shelves).extend({
  furniture: SelectFurnitureSchema.optional(),
  books: SelectMyBookSchema.array().optional(),
});
export const SelectShelvesShema = z.object({
  data: SelectShelfSchema.array(),
  meta: z.object({
    page: z.number(),
    pageSize: z.number(),
    total: z.number(),
  }),
});

export const shelvesRelations = relations(shelves, ({ one, many }) => ({
  furniture: one(furnitures, {
    fields: [shelves.furnitureId],
    references: [furnitures.id],
  }),
  owner: one(users, {
    fields: [shelves.ownerId],
    references: [users.id],
  }),
  books: many(myBooks),
}));
