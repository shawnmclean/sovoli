import { relations } from "drizzle-orm";

import { KnowledgeMediaAsset } from "./Knowledge";
import { MediaAsset } from "./MediaAsset";

export const MediaAssetRelations = relations(MediaAsset, ({ many }) => ({
  KnowledgeMediaAsset: many(KnowledgeMediaAsset),
}));
