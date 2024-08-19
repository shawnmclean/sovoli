import { relations } from "drizzle-orm";

import { shelves } from "./furnitures";
import { users } from "./identity";
import {
  authors,
  authorsToBooks,
  bookEmbeddings,
  books,
  myBooks,
} from "./myBooks";

export const booksRelations = relations(books, ({ many, one }) => ({
  myBooks: many(myBooks),
  embedding: one(bookEmbeddings),
  authorsToBooks: many(authorsToBooks),
}));

export const authorsRelations = relations(authors, ({ many }) => ({
  authorsToBooks: many(authorsToBooks),
}));

export const authorsToBooksRelations = relations(authorsToBooks, ({ one }) => ({
  author: one(authors, {
    fields: [authorsToBooks.authorId],
    references: [authors.id],
  }),
  book: one(books, {
    fields: [authorsToBooks.bookId],
    references: [books.id],
  }),
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

export const bookEmbeddingsRelations = relations(bookEmbeddings, ({ one }) => ({
  book: one(books, {
    fields: [bookEmbeddings.bookId],
    references: [books.id],
  }),
}));
