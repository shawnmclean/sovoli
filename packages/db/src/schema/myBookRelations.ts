import { relations } from "drizzle-orm";

import { Book } from "./Book";
import { myBooks } from "./myBooks";
import { User } from "./User";

export const myBooksRelations = relations(myBooks, ({ one }) => ({
  owner: one(User, {
    fields: [myBooks.ownerId],
    references: [User.id],
  }),
  book: one(Book, {
    fields: [myBooks.bookId],
    references: [Book.id],
  }),
}));
