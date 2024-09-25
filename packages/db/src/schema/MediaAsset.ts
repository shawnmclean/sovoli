import type { z } from "zod";
import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { createEnumObject } from "../utils";
import { Knowledge } from "./Knowledge";

const MediaAssetHosts = ["Supabase", "OpenAI"] as const;
export const MediaAssetHost = createEnumObject(MediaAssetHosts);

export const mediaAssetHostEnum = pgEnum("media_asset_host", MediaAssetHosts);
export const MediaAsset = pgTable("media_asset", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  knowledgeId: uuid("knowledge_id")
    .notNull()
    .references(() => Knowledge.id, { onDelete: "cascade" }),
  mimeType: varchar("mime_type", { length: 255 }),

  order: integer("order"),

  host: mediaAssetHostEnum("host").notNull(),

  // for supabase
  bucket: text("bucket"),
  path: text("path"),

  // for openai
  downloadLink: text("download_link"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const SelectMediaAssetSchema = createSelectSchema(MediaAsset);
export type SelectMediaAssetSchema = z.infer<typeof SelectMediaAssetSchema>;
export const InsertMediaAssetSchema = createInsertSchema(MediaAsset);
export type InsertMediaAssetSchema = z.infer<typeof InsertMediaAssetSchema>;
