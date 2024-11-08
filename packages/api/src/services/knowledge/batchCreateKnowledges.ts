import type { KnowledgeQueryType, KnowledgeType } from "@sovoli/db/schema";
import { db, schema } from "@sovoli/db";

export interface BatchCreateKnowledgesOptions {
  authUserId: string;
  knowledges: {
    title?: string;
    description?: string;
    content?: string;
    type: KnowledgeType;
    isOrigin?: boolean;
    query?: string;
    queryType?: KnowledgeQueryType;
  }[];
}

export class BatchCreateKnowledges {
  dbClient: typeof db;

  constructor(dbClient: typeof db = db) {
    this.dbClient = dbClient;
  }

  public async call({ authUserId, knowledges }: BatchCreateKnowledgesOptions) {
    if (knowledges.length === 0) {
      throw new Error("No knowledges provided");
    }

    const knowledgesToCreate = knowledges.map((knowledge) => ({
      ...knowledge,
      userId: authUserId,
    }));
    const createdKnowledges = await this.dbClient
      .insert(schema.Knowledge)
      .values(knowledgesToCreate)
      .returning();

    // TODO: call knowledgeUpserted

    return createdKnowledges;
  }
}
