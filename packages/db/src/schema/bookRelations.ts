import { relations } from "drizzle-orm";

import { Author, AuthorToBook, Book, BookEmbedding } from "./Book";
import { myBooks } from "./myBooks";

export const BookRelations = relations(Book, ({ many, one }) => ({
  myBooks: many(myBooks),
  embedding: one(BookEmbedding),
  authorsToBooks: many(AuthorToBook),
}));

export const AuthorRelations = relations(Author, ({ many }) => ({
  authorsToBooks: many(AuthorToBook),
}));

export const AuthorToBookRelations = relations(AuthorToBook, ({ one }) => ({
  author: one(Author, {
    fields: [AuthorToBook.authorId],
    references: [Author.id],
  }),
  book: one(Book, {
    fields: [AuthorToBook.bookId],
    references: [Book.id],
  }),
}));

export const BookEmbeddingRelations = relations(BookEmbedding, ({ one }) => ({
  book: one(Book, {
    fields: [BookEmbedding.bookId],
    references: [Book.id],
  }),
}));
