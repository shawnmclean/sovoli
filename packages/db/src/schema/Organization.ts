import { createId } from "@paralleldrive/cuid2";
import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const Organization = pgTable("organization", {
  id: varchar("id", { length: 256 }).primaryKey().$defaultFn(createId),

  name: varchar("name", { length: 100 }).notNull(),
  description: varchar("description", { length: 255 }),

  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});
