import { relations } from "drizzle-orm";

import { CollectionMediaAsset } from "./Collection";
import { MediaAsset } from "./MediaAsset";

export const MediaAssetRelations = relations(MediaAsset, ({ many }) => ({
  CollectionMediaAssets: many(CollectionMediaAsset),
}));
