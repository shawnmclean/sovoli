import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

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
