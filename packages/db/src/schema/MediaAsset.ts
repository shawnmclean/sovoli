import type { z } from "zod";
import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { createEnumObject } from "../utils";

const MediaAssetHosts = ["Supabase"] as const;
export const MediaAssetHost = createEnumObject(MediaAssetHosts);

export const mediaAssetHostEnum = pgEnum("media_asset_host", MediaAssetHosts);
export const MediaAsset = pgTable("media_asset", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),

  host: mediaAssetHostEnum("host").notNull(),
  bucket: text("bucket"),

  path: text("path"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const SelectMediaAssetSchema = createSelectSchema(MediaAsset);
export type SelectMediaAssetSchema = z.infer<typeof SelectMediaAssetSchema>;
export const InsertMediaAssetSchema = createInsertSchema(MediaAsset);
export type InsertMediaAssetSchema = z.infer<typeof InsertMediaAssetSchema>;
