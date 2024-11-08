import type { KnowledgeConnectionType } from "@sovoli/db/schema";
import { db, schema } from "@sovoli/db";

export interface BatchCreateConnectionsOptions {
  authUserId: string;
  connections: {
    sourceKnowledgeId: string;
    targetKnowledgeId: string;
    notes?: string;
    metadata?: {
      page?: number;
      chapter?: number;
    };
    type: KnowledgeConnectionType;
  }[];
}

export class BatchCreateConnections {
  dbClient: typeof db;

  constructor(dbClient: typeof db = db) {
    this.dbClient = dbClient;
  }

  public async call({ connections }: BatchCreateConnectionsOptions) {
    if (connections.length === 0) {
      throw new Error("No connections provided");
    }
    // TODO: should probably auth check if we can create connections for the source knowledge

    const createdConnections = await this.dbClient
      .insert(schema.KnowledgeConnection)
      .values(connections)
      .returning();

    return createdConnections;
  }
}
