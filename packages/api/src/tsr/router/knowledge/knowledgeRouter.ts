import type { BaseKnowledgeSchema } from "@sovoli/db/schema";
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

async function createKnowledge({
  knowledge,
  authUserId,
}: CreateKnowledgeOptions) {
  if (!authUserId) {
    throw new Error("authUserId is required");
  }
  const createdKnowledgeIds: string[] = [];
  const createdMediaAssetIds: string[] = [];
  let createdSourceKnowledge: BaseKnowledgeSchema | undefined;

  await db.transaction(async (tx) => {
    // TODO: handle duplicate slugs
    const sourceKnowledges = await tx
      .insert(schema.Knowledge)
      .values({
        title: knowledge.title,
        userId: authUserId,
        type: knowledge.type,
        isOrigin: true,
        slug: slugify(knowledge.title),
      })
      .returning();

    createdSourceKnowledge = sourceKnowledges[0];
    if (!createdSourceKnowledge) {
      throw new Error("Failed to create knowledge");
    }
    createdKnowledgeIds.push(createdSourceKnowledge.id);

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

  await hydrateKnowledge.batchTrigger(
    createdKnowledgeIds.map((id) => ({ payload: { knowledgeId: id } })),
  );
  await hydrateMedia.batchTrigger(
    createdMediaAssetIds.map((id) => ({ payload: { mediaId: id } })),
  );

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
