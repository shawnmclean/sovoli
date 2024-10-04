import type {
  InsertKnowledgeConnectionSchema,
  InsertKnowledgeSchema,
  InsertMediaAssetSchema,
  SelectKnowledgeConnectionSchema,
  SelectKnowledgeSchema,
} from "@sovoli/db/schema";
import { and, db, eq, inArray, schema } from "@sovoli/db";
import { MediaAssetHost, UserType } from "@sovoli/db/schema";

import type { PutKnowledgeSchemaRequest } from "../../tsr/router/knowledge/knowledgeContract";
import { hashAuthToken } from "../../utils/authTokens";

export interface CreateKnowledgeOptions {
  authUserId: string;
  knowledgeId: string;
  knowledge: PutKnowledgeSchemaRequest;
}

export const updateKnowledge = async ({
  authUserId,
  knowledgeId,
  knowledge,
}: CreateKnowledgeOptions) => {
  const knowledgeToUpdate = await db.query.Knowledge.findFirst({
    with: {
      User: {
        columns: { id: true, type: true },
      },
      SourceConnections: true,
      MediaAssets: true,
    },
    where: and(
      eq(schema.Knowledge.id, knowledgeId),
      eq(schema.Knowledge.userId, authUserId),
    ),
  });

  if (!knowledgeToUpdate) {
    throw Error("User does not have the rights to modify the knowledge");
  }
  // if the user is a bot, it can only update knowledge with the same auth token
  if (knowledgeToUpdate.User.type === UserType.Bot) {
    const token = knowledge.authToken;
    if (!token) {
      throw Error("Bot knowledge must have an auth token");
    }
    const hashedToken = hashAuthToken(token);
    if (hashedToken !== knowledgeToUpdate.authTokenHashed) {
      throw Error("Bot knowledge must have the same auth token");
    }
  }

  // update the parent knowledge
  const updatedKnowledges = await db
    .update(schema.Knowledge)
    .set({
      ...knowledge,
    })
    .where(eq(schema.Knowledge.id, knowledgeId))
    .returning();

  if (!updatedKnowledges[0]) {
    throw Error("Knowledge not found/updated");
  }

  const updatedKnowledge: SelectKnowledgeSchema = {
    ...updatedKnowledges[0],
    MediaAssets: [],
    SourceConnections: [],
  };

  // pull all target knowledge knowledge.connections array so we can batch insert them
  const targetKnowledges: InsertKnowledgeSchema[] = [];
  const connections: InsertKnowledgeConnectionSchema[] = [];
  if (knowledge.connections) {
    for (const connection of knowledge.connections) {
      // TODO: account for connections with id, meaning we need to update them
      if (!connection.targetKnowledge) {
        throw Error("Connection target knowledge is required");
      }
      // Collect target knowledge for batch insert
      targetKnowledges.push({
        query: connection.targetKnowledge.query,
        type: connection.targetKnowledge.type,
        userId: authUserId,
      });

      // Prepare connections with a placeholder for targetKnowledgeId
      connections.push({
        sourceKnowledgeId: updatedKnowledge.id,
        targetKnowledgeId: "temp",
        notes: connection.notes,
        type: connection.type,
        metadata: connection.metadata,
      });
    }
  }
  // use a transaction to submit all connections and target knowledge to ensure consistency
  if (targetKnowledges.length > 0) {
    await db.transaction(async (tx) => {
      const createdTargetKnowledges = await tx
        .insert(schema.Knowledge)
        .values(targetKnowledges)
        .returning();

      createdTargetKnowledges.forEach((targetKnowledge, index) => {
        if (connections[index]) {
          connections[index].targetKnowledgeId = targetKnowledge.id; // Replace "temp" with actual ID
        }
      });

      const createdConnections = await tx
        .insert(schema.KnowledgeConnection)
        .values(connections)
        .returning();

      createdConnections.forEach((connection) => {
        // Find the corresponding `TargetKnowledge` from `createdTargetKnowledges` by matching `targetKnowledgeId`
        const targetKnowledge = createdTargetKnowledges.find(
          (targetKnowledge) =>
            targetKnowledge.id === connection.targetKnowledgeId,
        );

        if (targetKnowledge) {
          const completeTargetKnowledge: SelectKnowledgeSchema = {
            ...targetKnowledge,
            SourceConnections: [],
            MediaAssets: [],
          };

          // Push the connection with its target knowledge into the source knowledge's connections array
          const selectConnection: SelectKnowledgeConnectionSchema = {
            ...connection,
            TargetKnowledge: completeTargetKnowledge, // Properly attach target knowledge
          };
          updatedKnowledge.SourceConnections.push(selectConnection);
        } else {
          throw new Error(
            `TargetKnowledge with id ${connection.targetKnowledgeId} not found`,
          );
        }
      });
    });
  }
  // update/ add media assets
  const mediaAssets: InsertMediaAssetSchema[] = [];
  if (knowledge.openaiFileIdRefs) {
    for (const openaiFileIdRef of knowledge.openaiFileIdRefs) {
      mediaAssets.push({
        knowledgeId: updatedKnowledge.id,
        host: MediaAssetHost.OpenAI,
        downloadLink: openaiFileIdRef.download_link,
        mimeType: openaiFileIdRef.mime_type,
        name: openaiFileIdRef.name,
      });
    }
  }
  // keeping this separate check if there are more assets in another future object other than openaiFileIdRefs
  if (mediaAssets.length > 0) {
    const createdMediaAssets = await db
      .insert(schema.MediaAsset)
      .values(mediaAssets)
      .returning();
    updatedKnowledge.MediaAssets = createdMediaAssets;
  }

  // if there are connections in delete, remove those
  if (knowledge.removeConnections) {
    await db.delete(schema.KnowledgeConnection).where(
      inArray(
        schema.KnowledgeConnection.id,
        knowledge.removeConnections.map((c) => c.id),
      ),
    );
  }

  // if there are media assets in delete, remove those
  if (knowledge.removeMediaAssets) {
    // TODO: clean up supabase storage first, (get path and delete)
    // await db.delete(schema.MediaAsset).where(
    //   inArray(
    //     schema.MediaAsset.id,
    //     knowledge.removeMediaAssets.map((c) => c.id),
    //   ),
    // );
  }

  return updatedKnowledge;
};
