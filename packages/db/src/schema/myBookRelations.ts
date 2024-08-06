import { relations } from "drizzle-orm";

import { shelves } from "./furnitures";
import { users } from "./identity";
import { books, myBooks } from "./myBooks";

export const booksRelations = relations(books, ({ many }) => ({
  myBooks: many(myBooks),
}));

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
