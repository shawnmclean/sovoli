import { relations } from "drizzle-orm";

import { Knowledge } from "./Knowledge";
import { MediaAsset } from "./MediaAsset";
import { User } from "./User";

export const MediaAssetRelations = relations(MediaAsset, ({ one }) => ({
  Knowledge: one(Knowledge, {
    fields: [MediaAsset.knowledgeId],
    references: [Knowledge.id],
  }),
  User: one(User, {
    fields: [MediaAsset.uploadedUserId],
    references: [User.id],
  }),
}));
