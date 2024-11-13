import type { KnowledgeConnectionType } from "@sovoli/db/schema";
import { db, eq, schema } from "@sovoli/db";

export interface BatchCreateConnectionsOptions {
  authUserId: string;
  sourceKnowledgeId: string;
  connections: {
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

  public async call({
    authUserId,
    sourceKnowledgeId,
    connections,
  }: BatchCreateConnectionsOptions) {
    if (connections.length === 0) {
      throw new Error("No connections provided");
    }
    const sourceKnowledge = await db.query.Knowledge.findFirst({
      where: eq(schema.Knowledge.id, sourceKnowledgeId),
    });

    if (!sourceKnowledge) {
      throw new Error("Source knowledge not found");
    }

    if (sourceKnowledge.userId !== authUserId) {
      throw new Error(
        "User does not have the rights to create connections for the source knowledge",
      );
    }

    const connectionsToCreate = connections.map((connection) => ({
      ...connection,
      sourceKnowledgeId: sourceKnowledgeId,
      userId: authUserId,
    }));

    const createdConnections = await this.dbClient
      .insert(schema.KnowledgeConnection)
      .values(connectionsToCreate)
      .returning();

    return createdConnections;
  }
}
