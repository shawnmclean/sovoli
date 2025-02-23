import type { z } from "zod";
import { createId } from "@paralleldrive/cuid2";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { createEnumObject } from "../utils";
import { Knowledge } from "./Knowledge";
import { User } from "./User";

const MediaAssetHosts = ["Supabase", "OpenAI", "Cloudinary"] as const;
export const MediaAssetHost = createEnumObject(MediaAssetHosts);

export const mediaAssetHostEnum = pgEnum("media_asset_host", MediaAssetHosts);
export const MediaAsset = pgTable("media_asset", {
  id: varchar("id", { length: 256 }).primaryKey().$defaultFn(createId),
  knowledgeId: varchar("knowledge_id", { length: 256 }).references(
    () => Knowledge.id,
    { onDelete: "cascade" },
  ),
  uploadedUserId: varchar("uploaded_user_id", { length: 256 }).references(
    () => User.id,
    { onDelete: "cascade" },
  ),
  mimeType: varchar("mime_type", { length: 255 }),

  order: integer("order"),

  host: mediaAssetHostEnum("host").notNull(),

  // for supabase
  bucket: text("bucket"),
  path: text("path"),

  // for openai
  name: text("name"),
  downloadLink: text("download_link"),

  // if this is set to true, check the host and remove the file, then remove this entity
  delete: boolean("delete"),

  triggerDevId: varchar("trigger_dev_id", { length: 255 }),
  triggerDevError: text("trigger_dev_error"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const SelectMediaAssetSchema = createSelectSchema(MediaAsset);
export type SelectMediaAssetSchema = z.infer<typeof SelectMediaAssetSchema>;
export const InsertMediaAssetSchema = createInsertSchema(MediaAsset);
export type InsertMediaAssetSchema = z.infer<typeof InsertMediaAssetSchema>;
