import { relations } from "drizzle-orm";

import { furnitures, shelves } from "./furnitures";
import { users } from "./identity";
import { myBooks } from "./myBooks";

export const furnituresRelations = relations(furnitures, ({ one, many }) => ({
  owner: one(users, {
    fields: [furnitures.ownerId],
    references: [users.id],
  }),
  shelves: many(shelves),
}));

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
