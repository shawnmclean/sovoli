import { relations } from "drizzle-orm";

import { authors, authorsToBooks, bookEmbeddings, books } from "./books";
import { myBooks } from "./myBooks";

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

export const bookEmbeddingsRelations = relations(bookEmbeddings, ({ one }) => ({
  book: one(books, {
    fields: [bookEmbeddings.bookId],
    references: [books.id],
  }),
}));
