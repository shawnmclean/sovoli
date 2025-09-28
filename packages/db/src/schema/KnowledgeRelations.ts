import { relations } from "drizzle-orm";

import { Knowledge } from "./Knowledge";
import { KnowledgeConnection } from "./KnowledgeConnection";
import { KnowledgeMediaAsset } from "./KnowledgeMediaAsset";
import { MediaAsset } from "./MediaAsset";
import { User } from "./User";

export const KnowledgeRelations = relations(Knowledge, ({ one, many }) => ({
  User: one(User, {
    fields: [Knowledge.userId],
    references: [User.id],
  }),
  SourceConnections: many(KnowledgeConnection, {
    relationName: "Source",
  }),
  TargetConnections: many(KnowledgeConnection, {
    relationName: "Target",
  }),
  Connections: many(KnowledgeConnection),
  MediaAssets: many(MediaAsset),
  KnowledgeMediaAssets: many(KnowledgeMediaAsset),
}));
