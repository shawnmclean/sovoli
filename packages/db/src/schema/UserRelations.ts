import { relations } from "drizzle-orm";

import { Knowledge } from "./Knowledge";
import { MediaAsset } from "./MediaAsset";
import { User } from "./User";

export const UserRelations = relations(User, ({ one, many }) => ({
  KnowledgeResources: many(Knowledge),
  ProfileImage: one(MediaAsset, {
    fields: [User.mediaAssetId],
    references: [MediaAsset.id],
  }),
}));
