import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import {
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { createEnumObject } from "../utils";
import { User } from "./User";

const ImportSources = ["storygraph", "goodreads"] as const;
export const ImportSource = createEnumObject(ImportSources);
export const importSourceEnum = pgEnum("import_source", ImportSources);

const ImportStatuses = ["pending", "running", "completed", "failed"] as const;
export const ImportStatus = createEnumObject(ImportStatuses);
export const importStatusEnum = pgEnum("import_status", ImportStatuses);

export const Import = pgTable("import", {
  id: varchar("id", { length: 256 }).primaryKey().$defaultFn(createId),

  userId: varchar("user_id", { length: 256 })
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),

  source: importSourceEnum("source").notNull(),
  importData: jsonb("import_data").default({}),
  errorData: jsonb("error_data"),

  triggerDevId: varchar("trigger_dev_id", { length: 255 }),
  triggerDevError: text("trigger_dev_error"),
  status: importStatusEnum("status").notNull().default(ImportStatus.pending),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type SelectImport = InferSelectModel<typeof Import>;

export type InsertImport = InferInsertModel<typeof Import>;
