import type {
  InsertKnowledgeSchema,
  InsertMediaAssetSchema,
  SelectKnowledgeSchema,
} from "@sovoli/db/schema";
import { db, schema } from "@sovoli/db";
import { MediaAssetHost } from "@sovoli/db/schema";

import type { PostKnowledgeSchemaRequest } from "../../tsr/router/knowledge/knowledgeContract";
import { hydrateKnowledge, hydrateMedia } from "../../trigger";
import { generateAuthToken, hashAuthToken } from "../../utils/authTokens";
import { slugify } from "../../utils/slugify";
import { createConnections } from "./createConnections";

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
  const createdSourceKnowledge = (await createParentKnowledge({
    ...knowledge,
    authTokenHashed,
    userId: authUserId,
    isOrigin: true,
  })) as SelectKnowledgeSchema;
  if (!createdSourceKnowledge.MediaAssets) {
    createdSourceKnowledge.MediaAssets = [];
  }
  if (!createdSourceKnowledge.SourceConnections) {
    createdSourceKnowledge.SourceConnections = [];
  }

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
    createdSourceKnowledge.MediaAssets = [
      ...createdSourceKnowledge.MediaAssets,
      ...createdMediaAssets,
    ];
  }

  if (knowledge.connections) {
    const createdConnections = await createConnections({
      authUserId,
      connections: knowledge.connections,
      parentKnowledge: createdSourceKnowledge,
    });
    createdSourceKnowledge.SourceConnections = [
      ...createdSourceKnowledge.SourceConnections,
      ...createdConnections,
    ];
  }

  const triggerPromises = [];
  if (createdSourceKnowledge.SourceConnections.length > 0) {
    const hydrateKnowledgePromise = hydrateKnowledge.batchTrigger([
      { payload: { knowledgeId: createdSourceKnowledge.id } }, // add the source knowledge to the queue
      ...createdSourceKnowledge.SourceConnections.map((connection) => ({
        // add the connections to the queue
        payload: { knowledgeId: connection.targetKnowledgeId },
      })),
    ]);

    triggerPromises.push(hydrateKnowledgePromise);
  }
  if (createdSourceKnowledge.MediaAssets.length > 0) {
    const mediaIds = createdSourceKnowledge.MediaAssets.map(
      (asset) => asset.id,
    );
    const hydrateMediaPromise = hydrateMedia.batchTrigger(
      mediaIds.map((id) => ({
        payload: {
          mediaId: id,
        },
      })),
    );
    console.log(`triggering media update for ids: ${mediaIds.join(", ")}`);
    triggerPromises.push(hydrateMediaPromise);
  }

  await Promise.all(triggerPromises);

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
        return sourceKnowledges[0];
      }
      retryCount++;
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
};
