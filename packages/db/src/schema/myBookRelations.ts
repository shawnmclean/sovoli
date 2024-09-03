import { relations } from "drizzle-orm";

import { books } from "./books";
import { shelves } from "./furnitures";
import { users } from "./identity";
import { myBooks } from "./myBooks";

export const myBooksRelations = relations(myBooks, ({ one }) => ({
  owner: one(users, {
    fields: [myBooks.ownerId],
    references: [users.id],
  }),
  shelf: one(shelves, {
    fields: [myBooks.shelfId],
    references: [shelves.id],
  }),
  book: one(books, {
    fields: [myBooks.bookId],
    references: [books.id],
  }),
}));
