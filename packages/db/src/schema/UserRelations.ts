import { relations } from "drizzle-orm";

import { Import } from "./Import";
import { Knowledge } from "./Knowledge";
import { MediaAsset } from "./MediaAsset";
import { User } from "./User";

export const UserRelations = relations(User, ({ one, many }) => ({
  KnowledgeResources: many(Knowledge),
  Imports: many(Import),
  ProfileImage: one(MediaAsset, {
    fields: [User.mediaAssetId],
    references: [MediaAsset.id],
  }),
}));
