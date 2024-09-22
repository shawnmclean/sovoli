import type { z } from "zod";
import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { Knowledge } from "./Knowledge";
import { MediaAsset, SelectMediaAssetSchema } from "./MediaAsset";

export const KnowledgeMediaAsset = pgTable("knowledge_media_asset", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  knowledgeId: uuid("knowledge_id")
    .notNull()
    .references(() => Knowledge.id, { onDelete: "cascade" }),
  mediaAssetId: uuid("media_asset_id")
    .notNull()
    .references(() => MediaAsset.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const SelectKnowledgeMediaAssetSchema = createSelectSchema(
  KnowledgeMediaAsset,
).extend({
  MediaAsset: SelectMediaAssetSchema,
});
export const InsertKnowledgeMediaAssetSchema =
  createInsertSchema(KnowledgeMediaAsset);
export type InsertKnowledgeMediaAssetSchema = z.infer<
  typeof InsertKnowledgeMediaAssetSchema
>;
export type SelectKnowledgeMediaAssetSchema = z.infer<
  typeof SelectKnowledgeMediaAssetSchema
>;
