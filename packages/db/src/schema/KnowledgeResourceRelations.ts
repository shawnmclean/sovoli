import { relations } from "drizzle-orm";

import { Book } from "./Book";
import { KnowledgeResource } from "./KnowledgeResource";
import { User } from "./User";

export const KnowledgeResourceRelations = relations(
  KnowledgeResource,
  ({ one }) => ({
    User: one(User, {
      fields: [KnowledgeResource.userId],
      references: [User.id],
    }),
    Book: one(Book, {
      fields: [KnowledgeResource.bookId],
      references: [Book.id],
    }),
  }),
);
