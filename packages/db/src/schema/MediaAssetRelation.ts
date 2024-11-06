import { relations } from "drizzle-orm";

import { Knowledge } from "./Knowledge";
import { MediaAsset } from "./MediaAsset";

export const MediaAssetRelations = relations(MediaAsset, ({ one }) => ({
  Knowledge: one(Knowledge, {
    fields: [MediaAsset.knowledgeIdVc],
    references: [Knowledge.id],
  }),
}));
