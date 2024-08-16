import { date, pgTable, uuid, varchar, vector } from "drizzle-orm/pg-core";

export const embeddingsCache = pgTable("embeddings_cache", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  text: varchar("text", { length: 255 }).notNull().unique(),
  openAIEmbedding: vector("open_ai_embedding", { dimensions: 1536 }).notNull(),
  createdAt: date("created_at").notNull().defaultNow(),
});
