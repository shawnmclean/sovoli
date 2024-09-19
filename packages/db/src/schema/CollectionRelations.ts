import { relations } from "drizzle-orm";

import { Collection, CollectionItem, CollectionMediaAsset } from "./Collection";
import { KnowledgeResource } from "./KnowledgeResource";
import { MediaAsset } from "./MediaAsset";
import { User } from "./User";

export const CollectionRelations = relations(Collection, ({ one, many }) => ({
  User: one(User, {
    fields: [Collection.userId],
    references: [User.id],
  }),
  CollectionItems: many(CollectionItem),
  CollectionMediaAssets: many(CollectionMediaAsset),
}));

export const CollectionMediaAssetRelations = relations(
  CollectionMediaAsset,
  ({ one }) => ({
    Collection: one(Collection, {
      fields: [CollectionMediaAsset.collectionId],
      references: [Collection.id],
    }),
    MediaAsset: one(MediaAsset, {
      fields: [CollectionMediaAsset.mediaAssetId],
      references: [MediaAsset.id],
    }),
  }),
);

export const CollectionItemRelations = relations(CollectionItem, ({ one }) => ({
  Collection: one(Collection, {
    fields: [CollectionItem.collectionId],
    references: [Collection.id],
  }),
  KnowledgeResource: one(KnowledgeResource, {
    fields: [CollectionItem.knowledgeResourceId],
    references: [KnowledgeResource.id],
  }),
}));
