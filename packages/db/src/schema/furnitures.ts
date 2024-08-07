import { jsonb, pgTable, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { users } from "./identity";

export const ImageSchema = z.object({
  url: z.string(),
  isCover: z.boolean().default(false),
  order: z.number().int().optional(),
  alt: z.string().optional(),
});

export type Image = z.infer<typeof ImageSchema>;

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
  }),
);

export const SelectFurnitureSchema = createSelectSchema(furnitures);
export const InsertFurnitureSchema = createInsertSchema(furnitures);

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
  }),
);

export const SelectShelfSchema = createSelectSchema(shelves);
export const InsertShelfSchema = createInsertSchema(shelves);
