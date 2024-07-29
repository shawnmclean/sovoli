import { relations } from "drizzle-orm";
import { jsonb, pgTable, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./identity";
import { myBooks } from "./myBooks";
import type { Image } from "./shared";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const furnitures = pgTable(
  "furniture",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => users.id),
  },
  (table) => ({
    uniqueSlug: unique().on(table.ownerId, table.slug),
  })
);

export const SelectFurnitureSchema = createSelectSchema(furnitures);
export const InsertFurnitureSchema = createInsertSchema(furnitures);

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
    images: jsonb("images").$type<Image[]>(),
    furnitureId: uuid("furniture_id")
      .notNull()
      .references(() => furnitures.id),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => users.id),
  },
  (table) => ({
    uniqueSlug: unique().on(table.ownerId, table.slug),
  })
);

export const SelectShelfSchema = createSelectSchema(shelves);
export const InsertShelfSchema = createInsertSchema(shelves);

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
