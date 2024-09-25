import { db, eq, schema } from "@sovoli/db";
import { AbortTaskRunError, logger, task } from "@trigger.dev/sdk/v3";

import { searchBooks } from "../services/books";

export interface HydrateKnowledgeOptions {
  knowledgeId: string;
}

export const hydrateKnowledge = task({
  id: "hydrate-knowledge",
  run: async ({ knowledgeId }: HydrateKnowledgeOptions) => {
    const knowledge = await db.query.Knowledge.findFirst({
      where: eq(schema.Knowledge.id, knowledgeId),
    });
    if (!knowledge) {
      throw new Error(`Knowledge not found`);
    }

    if (knowledge.bookId) {
      logger.info(`Knowledge already hydrated`);
      return;
    }
    if (!knowledge.query) {
      throw new AbortTaskRunError("Knowledge has no query");
    }

    logger.info(`Searching for query: ${knowledge.query}`);
    const results = await searchBooks({
      queries: [{ query: knowledge.query }],
    });

    if (!results[0]?.books[0]) {
      throw new Error("No results found for query");
    }

    const bestMatch = results[0].books[0];

    // TODO: figure out how to handle the case where the book is already linked
    // to a different knowledge for the same user
    await db
      .update(schema.Knowledge)
      .set({ bookId: bestMatch.id, title: bestMatch.title })
      .where(eq(schema.Knowledge.id, knowledgeId));
    logger.info(`Book: ${bestMatch.id} linked to Knowledge: ${knowledgeId}`);
  },
});
