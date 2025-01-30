import { relations } from "drizzle-orm";

import { Knowledge } from "./Knowledge";
import { KnowledgeMediaAsset } from "./KnowledgeMediaAsset";
import { MediaAsset } from "./MediaAsset";

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
