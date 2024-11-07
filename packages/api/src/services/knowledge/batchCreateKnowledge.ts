import type { KnowledgeQueryType, KnowledgeType } from "@sovoli/db/schema";
import { db, schema } from "@sovoli/db";

export interface BatchCreateKnowledgeOptions {
  authUserId: string;
  knowledges: {
    title?: string;
    description?: string;
    content?: string;
    type: KnowledgeType;
    isOrigin: boolean;
    query?: string;
    queryType?: KnowledgeQueryType;
  }[];
}

export class BatchCreateKnowledge {
  dbClient: typeof db;

  constructor(dbClient: typeof db = db) {
    this.dbClient = dbClient;
  }

  public async call({ authUserId, knowledges }: BatchCreateKnowledgeOptions) {
    if (knowledges.length === 0) {
      throw new Error("No knowledges provided");
    }

    const knowledgesToCreate = knowledges.map((knowledge) => ({
      ...knowledge,
      userId: authUserId,
    }));

    return await this.dbClient
      .insert(schema.Knowledge)
      .values(knowledgesToCreate)
      .returning();
  }
}
