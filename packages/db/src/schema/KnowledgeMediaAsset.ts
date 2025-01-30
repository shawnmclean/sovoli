import type { InferSelectModel } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import type { SelectMediaAssetSchema } from "./MediaAsset";
import { createEnumObject } from "../utils";
import { Knowledge } from "./Knowledge";
import { MediaAsset } from "./MediaAsset";

export const KnowledgeMediaAssetPlacements = ["cover", "inline"] as const;
export const KnowledgeMediaAssetPlacement = createEnumObject(
  KnowledgeMediaAssetPlacements,
);
export type KnowledgeMediaAssetPlacement =
  (typeof KnowledgeMediaAssetPlacements)[number];
export const knowledgeMediaAssetPlacementEnum = pgEnum(
  "knowledge_media_asset_placement",
  KnowledgeMediaAssetPlacements,
);

export const KnowledgeMediaAsset = pgTable(
  "knowledge_media_asset",
  {
    knowledgeId: varchar("knowledge_id", { length: 256 })
      .notNull()
      .references(() => Knowledge.id, { onDelete: "cascade" }),
    mediaAssetId: varchar("media_asset_id", { length: 256 })
      .notNull()
      .references(() => MediaAsset.id, { onDelete: "cascade" }),

    placement: knowledgeMediaAssetPlacementEnum("placement")
      .notNull()
      .default(KnowledgeMediaAssetPlacement.cover),

    // optional ordering for the assets that are cover placement (for carousel)
    order: integer("order"),

    notes: text("notes"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.knowledgeId, table.mediaAssetId] }),
  }),
);

export type KnowledgeMediaAsset = InferSelectModel<
  typeof KnowledgeMediaAsset
> & {
  MediaAsset: SelectMediaAssetSchema;
};
