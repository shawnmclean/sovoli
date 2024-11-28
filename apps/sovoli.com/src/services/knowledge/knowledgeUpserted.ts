import type { SelectBook, SelectKnowledgeSchema } from "@sovoli/db/schema";
import { and, db, eq, schema } from "@sovoli/db";
import { KnowledgeQueryType, KnowledgeType } from "@sovoli/db/schema";

import { findBookByISBN } from "../books/findBookByISBN";
import { searchBooksByQuery } from "../books/searchBooksByQuery";
import { PublishKnowledge } from "./publishKnowledge";

export interface KnowledgeUpsertedOptions {
  knowledgeId: string;

  /**
   * this is used for if the event was triggered by a background job service
   */
  jobId?: string;
}

export const knowledgeUpserted = async ({
  knowledgeId,
  jobId,
}: KnowledgeUpsertedOptions) => {
  const knowledge = await db.query.Knowledge.findFirst({
    with: {
      User: {
        columns: {
          id: true,
        },
      },
      // targetconnections here means that the knowledge itself is the target and its getting the connections to a source
      TargetConnections: true,
    },
    where: eq(schema.Knowledge.id, knowledgeId),
  });
  if (!knowledge) {
    throw new Error(`Knowledge not found`);
  }

  try {
    switch (knowledge.type) {
      case KnowledgeType.book:
        await handleBookKnowledgeTypeUpserted(knowledge);
        break;
      case KnowledgeType.note:
        handleNoteKnowledgeTypeUpserted();
        break;
      case KnowledgeType.collection:
        handleCollectionKnowledgeTypeUpserted();
        break;
      case KnowledgeType.shelf:
        handleCollectionKnowledgeTypeUpserted();
        break;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(`Error handling knowledge ${knowledge.id}: ${error.message}`);
      await db
        .update(schema.Knowledge)
        .set({
          jobError: error.message,
          jobId: jobId,
        })
        .where(eq(schema.Knowledge.id, knowledgeId));
    }
    throw error;
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
  if (
    knowledge.queryType !== KnowledgeQueryType.isbn &&
    knowledge.queryType !== KnowledgeQueryType.query
  ) {
    throw new Error(
      "Knowledge query type must be either isbn or query for a book",
    );
  }

  let book: SelectBook | undefined;

  switch (knowledge.queryType) {
    case KnowledgeQueryType.isbn: {
      console.log("searching for book by isbn");
      const result = await findBookByISBN({
        isbn: knowledge.query,
      });
      book = result.book;
      break;
    }
    case KnowledgeQueryType.query: {
      console.log("searching for book by query");
      const results = await searchBooksByQuery({
        query: knowledge.query,
      });
      book = results.books[0];
      break;
    }
  }

  if (!book) {
    throw new Error(
      `No book found for query: ${knowledge.query}, type: ${knowledge.queryType}`,
    );
  }

  // check if user already has the book
  const bookKnowledge = await db.query.Knowledge.findFirst({
    where: and(
      eq(schema.Knowledge.bookId, book.id),
      eq(schema.Knowledge.userId, knowledge.User.id),
    ),
  });

  if (
    bookKnowledge &&
    knowledge.TargetConnections &&
    knowledge.TargetConnections.length > 0
  ) {
    // link the connections to the book knowledge and remove the old one
    // If we try to link a book to a shelf that already has a book, we will get an error
    for (const connection of knowledge.TargetConnections) {
      try {
        await db
          .update(schema.KnowledgeConnection)
          .set({
            targetKnowledgeId: bookKnowledge.id,
          })
          .where(eq(schema.KnowledgeConnection.id, connection.id));
      } catch (error) {
        const queryError = error as QueryError;
        if (
          typeof queryError.code === "string" &&
          queryError.code === "23505"
        ) {
          console.log("Book already linked to parent");
        } else {
          throw error; // Re-throw other errors
        }
      }
    }

    // TODO: maybe not delete it? but redirect it? When we run into the issues we look back at this
    await db
      .delete(schema.Knowledge)
      .where(eq(schema.Knowledge.id, knowledge.id));
  } else {
    // update the knowledge with the book information
    await db
      .update(schema.Knowledge)
      .set({
        bookId: book.id,
        title: book.title,
      })
      .where(eq(schema.Knowledge.id, knowledge.id));

    const publishKnowledge = new PublishKnowledge();
    await publishKnowledge.call({
      authUserId: knowledge.userId,
      knowledgeId: knowledge.id,
    });
  }
};

const handleNoteKnowledgeTypeUpserted = () => {
  console.log("upsert event on note, nothing to do here");
};

const handleCollectionKnowledgeTypeUpserted = () => {
  console.log("upsert event on collection, nothing to do here");
};
