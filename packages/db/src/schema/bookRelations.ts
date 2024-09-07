import { relations } from "drizzle-orm";

import { Author, authorsToBooks, bookEmbeddings, books } from "./books";
import { myBooks } from "./myBooks";

export const booksRelations = relations(books, ({ many, one }) => ({
  myBooks: many(myBooks),
  embedding: one(bookEmbeddings),
  authorsToBooks: many(authorsToBooks),
}));

export const authorsRelations = relations(Author, ({ many }) => ({
  authorsToBooks: many(authorsToBooks),
}));

export const authorsToBooksRelations = relations(authorsToBooks, ({ one }) => ({
  author: one(Author, {
    fields: [authorsToBooks.authorId],
    references: [Author.id],
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
