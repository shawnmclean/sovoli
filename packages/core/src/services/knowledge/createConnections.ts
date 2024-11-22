import type {
  InsertKnowledgeConnectionSchema,
  InsertKnowledgeSchema,
  SelectKnowledgeConnectionSchema,
  SelectKnowledgeSchema,
} from "@sovoli/db/schema";
import { db, schema } from "@sovoli/db";

import type { PostConnectionSchema } from "../../tsr/router/knowledge/knowledgeContract";

export interface CreateConnectionsOptions {
  authUserId: string;
  parentKnowledge: SelectKnowledgeSchema;
  connections: PostConnectionSchema[];
}

export const createConnections = async ({
  authUserId,
  connections,
  parentKnowledge,
}: CreateConnectionsOptions) => {
  if (connections.length === 0) {
    return [];
  }

  // pull all target knowledge knowledge.connections array so we can batch insert them
  const targetKnowledges: InsertKnowledgeSchema[] = [];
  const connectionsToInsert: InsertKnowledgeConnectionSchema[] = [];
  const createdKnowledgeConnections: SelectKnowledgeConnectionSchema[] = [];
  for (const connection of connections) {
    // Collect target knowledge for batch insert
    targetKnowledges.push({
      query: connection.targetKnowledge.query,
      type: connection.targetKnowledge.type,
      queryType: connection.targetKnowledge.queryType,
      userId: authUserId,
      isPublic: parentKnowledge.isPublic,
    });

    // Prepare connections with a placeholder for targetKnowledgeId
    connectionsToInsert.push({
      sourceKnowledgeId: parentKnowledge.id,
      targetKnowledgeId: "temp",
      notes: connection.notes,
      type: connection.type,
      metadata: connection.metadata,
    });
  }
  // use a transaction to submit all connections and target knowledge to ensure consistency
  if (targetKnowledges.length > 0) {
    await db.transaction(async (tx) => {
      const createdTargetKnowledges = await tx
        .insert(schema.Knowledge)
        .values(targetKnowledges)
        .returning();

      // TODO: should we call trigger here instead of at the parent level?

      createdTargetKnowledges.forEach((targetKnowledge, index) => {
        if (connectionsToInsert[index]) {
          connectionsToInsert[index].targetKnowledgeId = targetKnowledge.id; // Replace "temp" with actual ID
        }
      });

      const createdConnections = await tx
        .insert(schema.KnowledgeConnection)
        .values(connectionsToInsert)
        .returning();

      createdConnections.forEach((connection) => {
        // Find the corresponding `TargetKnowledge` from `createdTargetKnowledges` by matching `targetKnowledgeId`
        const targetKnowledge = createdTargetKnowledges.find(
          (targetKnowledge) =>
            targetKnowledge.id === connection.targetKnowledgeId,
        );

        if (targetKnowledge) {
          createdKnowledgeConnections.push({
            ...connection,
            TargetKnowledge: {
              ...targetKnowledge,
              SourceConnections: [],
              MediaAssets: [],
            }, // Properly attach target knowledge
          });
        } else {
          throw new Error(
            `TargetKnowledge with id ${connection.targetKnowledgeId} not found`,
          );
        }
      });
    });
  }
  return createdKnowledgeConnections;
};
