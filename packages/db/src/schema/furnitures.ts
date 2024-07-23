import { relations, sql } from "drizzle-orm";
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./identity";

export const furnitures = pgTable("furniture", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }),
  ownerId: uuid("ownerId")
    .notNull()
    .references(() => users.id),
});

export const furnituresRelations = relations(furnitures, ({ one }) => ({
  owner: one(users, {
    fields: [furnitures.ownerId],
    references: [users.id],
  }),
}));
