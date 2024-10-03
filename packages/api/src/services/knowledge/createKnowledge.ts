import type {
  InsertKnowledgeConnectionSchema,
  InsertKnowledgeSchema,
  InsertMediaAssetSchema,
  SelectKnowledgeConnectionSchema,
  SelectKnowledgeSchema,
} from "@sovoli/db/schema";
import { db, schema } from "@sovoli/db";
import { MediaAssetHost } from "@sovoli/db/schema";

import type { PostKnowledgeSchemaRequest } from "../../tsr/router/knowledge/knowledgeContract";
import { hydrateKnowledge, hydrateMedia } from "../../trigger";
import { generateAuthToken, hashAuthToken } from "../../utils/authTokens";
import { slugify } from "../../utils/slugify";

export interface CreateKnowledgeOptions {
  authUserId: string;
  knowledge: PostKnowledgeSchemaRequest;
}

export const createKnowledge = async ({
  authUserId,
  knowledge,
}: CreateKnowledgeOptions) => {
  const authToken = generateAuthToken();
  const authTokenHashed = hashAuthToken(authToken);
  const createdSourceKnowledge = await createParentKnowledge({
    ...knowledge,
    authTokenHashed,
    userId: authUserId,
    isOrigin: true,
  });

  const mediaAssets: InsertMediaAssetSchema[] = [];
  if (knowledge.openaiFileIdRefs) {
    for (const openaiFileIdRef of knowledge.openaiFileIdRefs) {
      mediaAssets.push({
        knowledgeId: createdSourceKnowledge.id,
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
    createdSourceKnowledge.MediaAssets = createdMediaAssets;
  }

  // pull all target knowledge knowledge.connections array so we can batch insert them
  const targetKnowledges: InsertKnowledgeSchema[] = [];
  const connections: InsertKnowledgeConnectionSchema[] = [];
  if (knowledge.connections) {
    for (const connection of knowledge.connections) {
      // Collect target knowledge for batch insert
      targetKnowledges.push({
        query: connection.targetKnowledge.query,
        type: connection.targetKnowledge.type,
        userId: authUserId,
      });

      // Prepare connections with a placeholder for targetKnowledgeId
      connections.push({
        sourceKnowledgeId: createdSourceKnowledge.id,
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
            Connections: [],
            MediaAssets: [],
          };

          // Push the connection with its target knowledge into the source knowledge's connections array
          const selectConnection: SelectKnowledgeConnectionSchema = {
            ...connection,
            TargetKnowledge: completeTargetKnowledge, // Properly attach target knowledge
          };
          createdSourceKnowledge.Connections.push(selectConnection);
        } else {
          throw new Error(
            `TargetKnowledge with id ${connection.targetKnowledgeId} not found`,
          );
        }
      });
    });
  }

  if (createdSourceKnowledge.Connections.length > 0) {
    await hydrateKnowledge.batchTrigger([
      { payload: { knowledgeId: createdSourceKnowledge.id } }, // add the source knowledge to the queue
      ...createdSourceKnowledge.Connections.map((connection) => ({
        // add the connections to the queue
        payload: { knowledgeId: connection.targetKnowledgeId },
      })),
    ]);
  }
  if (createdSourceKnowledge.MediaAssets.length > 0) {
    await hydrateMedia.batchTrigger(
      createdSourceKnowledge.MediaAssets.map((asset) => ({
        payload: { mediaId: asset.id },
      })),
    );
  }

  // TOODO: rebuild the knowledge with the connections and media assets
  return {
    knowledge: createdSourceKnowledge,
    authToken,
  };
};

type QueryError = Error & { code?: unknown };
const createParentKnowledge = async (knowledge: InsertKnowledgeSchema) => {
  if (!knowledge.title) {
    throw new Error("title is required");
  }
  let slug = slugify(knowledge.title);
  let createdSourceKnowledge: SelectKnowledgeSchema | undefined;
  let retryCount = 0;
  while (retryCount < 50) {
    try {
      const sourceKnowledges = await db
        .insert(schema.Knowledge)
        .values({
          ...knowledge,
          slug: slug,
        })
        .returning();

      if (sourceKnowledges[0]) {
        createdSourceKnowledge = {
          ...sourceKnowledges[0],
          MediaAssets: [],
          Connections: [],
        };
        break;
      }
    } catch (error) {
      const queryError = error as QueryError;
      if (typeof queryError.code === "string" && queryError.code === "23505") {
        // Unique violation (Postgres specific error code)
        // Regenerate slug by appending a unique identifier (e.g., retryCount)
        slug = slugify(knowledge.title) + "-" + (retryCount + 1);
        retryCount++;
      } else {
        throw error; // Re-throw other errors
      }
    }
  }

  if (!createdSourceKnowledge) {
    throw new Error("Failed to create knowledge after retries");
  }

  return createdSourceKnowledge;
};
