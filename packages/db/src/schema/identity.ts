import { relations } from "drizzle-orm";
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { furnitures, shelves } from "./furnitures";

export const users = pgTable("user", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }),
  username: varchar("username", { length: 255 }).notNull().unique(),
});

export const usersRelations = relations(users, ({ many }) => ({
  furnitures: many(furnitures),
  shelves: many(shelves),
}));

export const SelectUserSchema = createSelectSchema(users);
