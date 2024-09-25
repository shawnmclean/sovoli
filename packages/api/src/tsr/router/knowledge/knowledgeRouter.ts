import type {
  BaseKnowledgeSchema,
  InsertKnowledgeSchema,
} from "@sovoli/db/schema";
import { db, schema } from "@sovoli/db";
import { MediaAssetHost } from "@sovoli/db/schema";
import { tsr } from "@ts-rest/serverless/fetch";

import type { PlatformContext, TSRAuthContext } from "../../types";
import type { PostKnowledgeSchemaRequest } from "./knowledgeContract";
import { hydrateKnowledge, hydrateMedia } from "../../../trigger";
import { authMiddleware } from "../authMiddleware";
import { knowledgeContract } from "./knowledgeContract";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .split(/\s+/)
    .filter((word) => word.length)
    .join("-");
}

interface BaseOptions {
  authUserId?: string;
}

interface CreateKnowledgeOptions extends BaseOptions {
  knowledge: PostKnowledgeSchemaRequest;
}

type QueryError = Error & { code?: unknown };
async function createParentKnowledge(knowledge: InsertKnowledgeSchema) {
  if (!knowledge.title) {
    throw new Error("title is required");
  }
  let slug = slugify(knowledge.title);
  let createdSourceKnowledge: BaseKnowledgeSchema | undefined;
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

      createdSourceKnowledge = sourceKnowledges[0];
      if (createdSourceKnowledge) {
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
  return createdSourceKnowledge;
}

async function createKnowledge({
  knowledge,
  authUserId,
}: CreateKnowledgeOptions) {
  if (!authUserId) {
    throw new Error("authUserId is required");
  }
  const createdKnowledgeIds: string[] = [];
  const createdMediaAssetIds: string[] = [];
  const createdSourceKnowledge = await createParentKnowledge({
    title: knowledge.title,
    userId: authUserId,
    type: knowledge.type,
    isOrigin: true,
  });

  if (!createdSourceKnowledge) {
    throw new Error("Failed to create knowledge after retries");
  }
  createdKnowledgeIds.push(createdSourceKnowledge.id);

  // use a transaction to submit all connections, target knowledge, and media assets to ensure consistency
  await db.transaction(async (tx) => {
    if (knowledge.connections) {
      // TODO: batch insert the knowledge and then connections
      for (const connection of knowledge.connections) {
        // Insert the connected knowledge item
        const targetKnowledge = await tx
          .insert(schema.Knowledge)
          .values({
            query: connection.targetKnowledge.query,
            type: connection.targetKnowledge.type,
            userId: authUserId,
          })
          .returning({ id: schema.Knowledge.id });

        const targetKnowledgeId = targetKnowledge[0]?.id;
        if (!targetKnowledgeId) {
          throw new Error("Failed to create target knowledge");
        }
        createdKnowledgeIds.push(targetKnowledgeId);

        // Create the connection between the main knowledge and the target knowledge
        await tx.insert(schema.KnowledgeConnection).values({
          sourceKnowledgeId: createdSourceKnowledge.id,
          targetKnowledgeId,
          notes: connection.notes,
          type: connection.type,
        });
      }
    }

    if (knowledge.openaiFileIdRefs) {
      // TODO batch insert these
      for (const openaiFileIdRef of knowledge.openaiFileIdRefs) {
        const createdMediaAsset = await tx
          .insert(schema.MediaAsset)
          .values({
            knowledgeId: createdSourceKnowledge.id,
            host: MediaAssetHost.OpenAI,
            downloadLink: openaiFileIdRef.download_link,
            mimeType: openaiFileIdRef.mime_type,
            name: openaiFileIdRef.name,
          })
          .returning();
        const mediaAsset = createdMediaAsset[0];
        if (!mediaAsset) {
          throw new Error("Failed to create media asset");
        }
        createdMediaAssetIds.push(mediaAsset.id);
      }
    }
  });

  if (createdKnowledgeIds.length > 0) {
    await hydrateKnowledge.batchTrigger(
      createdKnowledgeIds.map((id) => ({ payload: { knowledgeId: id } })),
    );
  }
  if (createdMediaAssetIds.length > 0) {
    await hydrateMedia.batchTrigger(
      createdMediaAssetIds.map((id) => ({ payload: { mediaId: id } })),
    );
  }

  // TOODO: rebuild the knowledge with the connections and media assets
  return createdSourceKnowledge;
}

export const knowledgeRouter = tsr
  .platformContext<PlatformContext>()
  .routerBuilder(knowledgeContract)
  .routeWithMiddleware("postKnowledge", (routerBuilder) =>
    routerBuilder
      .middleware<TSRAuthContext>(authMiddleware)
      .handler(async ({ body }, { request: { user } }) => {
        const createdKnowledge = await createKnowledge({
          knowledge: body,
          authUserId: user.id,
        });

        if (!createdKnowledge) throw new Error("Failed to create knowledge");
        return {
          status: 200,
          body: createdKnowledge,
        };
      }),
  );
