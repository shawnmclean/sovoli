import { char, date, doublePrecision, pgTable } from "drizzle-orm/pg-core";

export const bookSearchEmbeddingsCache = pgTable(
  "book_search_embeddings_cache",
  {
    // used for storing SH-256 hashes
    id: char("id", { length: 64 }).notNull().primaryKey(),
    openAIEmbedding: doublePrecision("open_ai_embedding").array().notNull(),
    createdAt: date("created_at").notNull().defaultNow(),
  },
);
