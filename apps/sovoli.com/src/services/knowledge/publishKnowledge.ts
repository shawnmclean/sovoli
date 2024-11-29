import { eq, schema } from "@sovoli/db";

import { slugify } from "~/utils/slugify";
import { BaseService } from "../baseService";

export interface PublishKnowledgeOptions {
  authUserId: string;
  knowledgeId: string;
}

export class PublishKnowledge extends BaseService {
  public async call({ authUserId, knowledgeId }: PublishKnowledgeOptions) {
    const knowledge = await this.dbClient.query.Knowledge.findFirst({
      where: eq(schema.Knowledge.id, knowledgeId),
    });

    if (!knowledge) {
      throw new Error(`Knowledge not found`);
    }

    if (knowledge.userId !== authUserId) {
      throw new Error("User does not have the rights to publish the knowledge");
    }

    let slug = slugify(knowledge.title ?? "");
    let retryCount = 0;
    while (retryCount < 50) {
      try {
        await this.dbClient
          .update(schema.Knowledge)
          .set({
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
          slug = slugify(knowledge.title ?? "") + "-" + (retryCount + 1);
          retryCount++;
        } else {
          throw error; // Re-throw other errors
        }
      }
    }
  }
}

type QueryError = Error & { code?: unknown };
