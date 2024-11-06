import { db, schema } from "@sovoli/db";

export interface BatchCreateKnowledgeOptions {
  authUserId: string;
  title: string;
}

export class BatchCreateKnowledge {
  dbClient: typeof db;

  constructor(dbClient: typeof db = db) {
    this.dbClient = dbClient;
  }

  public async call({ authUserId, title }: BatchCreateKnowledgeOptions) {
    console.log("create");
    await this.dbClient.insert(schema.Knowledge).values({
      userId: authUserId,
      title,
    });
  }
}
