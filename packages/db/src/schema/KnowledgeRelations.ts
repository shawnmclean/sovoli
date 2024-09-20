import { relations } from "drizzle-orm";

import { Book } from "./Book";
import { Knowledge, KnowledgeMediaAsset } from "./Knowledge";
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
  KnowledgeConnections: many(KnowledgeConnection),
  KnowledgeMediaAssets: many(KnowledgeMediaAsset),
}));

export const KnowledgeMediaAssetRelations = relations(
  KnowledgeMediaAsset,
  ({ one }) => ({
    Knowledge: one(Knowledge, {
      fields: [KnowledgeMediaAsset.knowledgeId],
      references: [Knowledge.id],
    }),
    MediaAsset: one(MediaAsset, {
      fields: [KnowledgeMediaAsset.mediaAssetId],
      references: [MediaAsset.id],
    }),
  }),
);
