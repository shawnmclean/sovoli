import { relations } from "drizzle-orm";

import { furnitures, shelves } from "./furnitures";
import { users } from "./identity";
import { myBooks } from "./myBooks";

export const usersRelations = relations(users, ({ many }) => ({
  furnitures: many(furnitures),
  shelves: many(shelves),
  myBooks: many(myBooks),
}));
