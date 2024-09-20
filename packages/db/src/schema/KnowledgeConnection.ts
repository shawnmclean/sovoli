import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { Knowledge } from "./Knowledge";

export const KnowledgeConnection = pgTable("knowledge_connection", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),

  sourceKnowledgeId: uuid("source_knowledge_id")
    .notNull()
    .references(() => Knowledge.id, { onDelete: "cascade" }),
  targetKnowledgeId: uuid("target_knowledge_id")
    .notNull()
    .references(() => Knowledge.id, { onDelete: "cascade" }),

  // optional ordering for the items in the collection (useful for study guides or arranging books on a shelf)
  order: integer("order"),

  notes: text("notes"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
