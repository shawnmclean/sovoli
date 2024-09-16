import { relations } from "drizzle-orm";

import { Collection, CollectionItem } from "./Collection";
import { KnowledgeResource } from "./KnowledgeResource";
import { User } from "./User";

export const CollectionRelations = relations(Collection, ({ one, many }) => ({
  User: one(User, {
    fields: [Collection.userId],
    references: [User.id],
  }),
  CollectionItems: many(CollectionItem),
}));

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
