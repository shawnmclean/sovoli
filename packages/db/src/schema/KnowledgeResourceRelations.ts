import { relations } from "drizzle-orm";

import { books } from "./books";
import { users } from "./identity";
import { KnowledgeResource } from "./KnowledgeResource";

export const KnowledgeResourceRelations = relations(
  KnowledgeResource,
  ({ one }) => ({
    User: one(users, {
      fields: [KnowledgeResource.userId],
      references: [users.id],
    }),
    KnowledgeResource: one(books, {
      fields: [KnowledgeResource.bookId],
      references: [books.id],
    }),
  }),
);
