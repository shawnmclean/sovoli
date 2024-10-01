import { relations } from "drizzle-orm";

import { Book } from "./Book";
import { Knowledge } from "./Knowledge";
import { KnowledgeConnection } from "./KnowledgeConnection";
import { MediaAsset } from "./MediaAsset";
import { User } from "./User";

export const KnowledgeRelations = relations(Knowledge, ({ one, many }) => ({
  User: one(User, {
    fields: [Knowledge.userId],
    references: [User.id],
  }),
  Book: one(Book, {
    fields: [Knowledge.bookId],
    references: [Book.id],
  }),
  Connections: many(KnowledgeConnection),
  MediaAssets: many(MediaAsset),
}));
