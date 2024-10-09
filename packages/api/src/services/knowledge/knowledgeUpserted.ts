import type { SelectKnowledgeSchema } from "@sovoli/db/schema";
import { and, db, eq, inArray, schema } from "@sovoli/db";

import { slugify } from "../../utils/slugify";
import { searchBooks } from "../books";

export interface KnowledgeUpsertedOptions {
  knowledgeId: string;
}

export const knowledgeUpserted = async ({
  knowledgeId,
}: KnowledgeUpsertedOptions) => {
  const knowledge = await db.query.Knowledge.findFirst({
    with: {
      User: {
        columns: {
          id: true,
        },
      },
      TargetConnections: true,
    },
    where: eq(schema.Knowledge.id, knowledgeId),
  });
  if (!knowledge) {
    throw new Error(`Knowledge not found`);
  }

  switch (knowledge.type) {
    case "Book":
      await handleBookKnowledgeTypeUpserted(knowledge);
      break;
    case "Note":
      handleNoteKnowledgeTypeUpserted();
      break;
    case "Collection":
      handleCollectionKnowledgeTypeUpserted();
      break;
  }
};

type QueryError = Error & { code?: unknown };
const handleBookKnowledgeTypeUpserted = async (
  knowledge: SelectKnowledgeSchema & {
    User: {
      id: string;
    };
  },
) => {
  if (knowledge.bookId) {
    console.log(`Knowledge already hydrated`);
    return;
  }
  if (!knowledge.query) {
    throw new Error("Knowledge has no query");
  }
  console.log(`Searching for query: ${knowledge.query}`);
  const results = await searchBooks({
    queries: [{ query: knowledge.query }],
  });

  if (!results[0]?.books[0]) {
    throw new Error("No results found for query");
  }

  const bestMatch = results[0].books[0];

  // check if user already has the book
  const bookKnowledge = await db.query.Knowledge.findFirst({
    where: and(
      eq(schema.Knowledge.bookId, bestMatch.id),
      eq(schema.Knowledge.userId, knowledge.User.id),
    ),
  });

  if (
    bookKnowledge &&
    knowledge.TargetConnections &&
    knowledge.TargetConnections.length > 0
  ) {
    // link the connections to the book knowledge and remove the old one
    await db
      .update(schema.KnowledgeConnection)
      .set({
        targetKnowledgeId: bookKnowledge.id,
      })
      .where(
        inArray(
          schema.KnowledgeConnection.id,
          knowledge.TargetConnections.map((connection) => connection.id),
        ),
      );

    // TODO: maybe not delete it? but redirect it? When we run into the issues we look back at this
    await db
      .delete(schema.Knowledge)
      .where(eq(schema.Knowledge.id, knowledge.id));
  } else {
    // update the knowledge with the book information
    let slug = slugify(bestMatch.title);
    let retryCount = 0;
    while (retryCount < 50) {
      try {
        await db
          .update(schema.Knowledge)
          .set({
            bookId: bestMatch.id,
            title: bestMatch.title,
            slug,
          })
          .where(eq(schema.Knowledge.id, knowledge.id));
        return;
      } catch (error) {
        const queryError = error as QueryError;
        if (
          typeof queryError.code === "string" &&
          queryError.code === "23505"
        ) {
          // Unique violation (Postgres specific error code)
          // Regenerate slug by appending a unique identifier (e.g., retryCount)
          slug = slugify(bestMatch.title) + "-" + (retryCount + 1);
          retryCount++;
        } else {
          throw error; // Re-throw other errors
        }
      }
    }
  }
};

const handleNoteKnowledgeTypeUpserted = () => {
  console.log("upsert event on note, nothing to do here");
};

const handleCollectionKnowledgeTypeUpserted = () => {
  console.log("upsert event on collection, nothing to do here");
};
