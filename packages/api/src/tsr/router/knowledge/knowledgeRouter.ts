import { db, schema } from "@sovoli/db";
import { tsr } from "@ts-rest/serverless/fetch";

import type { PlatformContext, TSRAuthContext } from "../../types";
import type { PostKnowledgeSchemaRequest } from "./knowledgeContract";
import { authMiddleware } from "../authMiddleware";
import { knowledgeContract } from "./knowledgeContract";

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

  console.log(JSON.stringify(knowledge, null, 2));
  await db.transaction(async (tx) => {
    const sourceKnowledge = await tx
      .insert(schema.Knowledge)
      .values({
        title: knowledge.title,
        userId: authUserId,
        type: knowledge.type,
      })
      .returning({ id: schema.Knowledge.id });

    const sourceKnowledgeId = sourceKnowledge[0]?.id;
    if (!sourceKnowledgeId) {
      throw new Error("Failed to create knowledge");
    }

    if (knowledge.connections?.length) {
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

        // Create the connection between the main knowledge and the target knowledge
        await tx.insert(schema.KnowledgeConnection).values({
          sourceKnowledgeId,
          targetKnowledgeId,
          notes: connection.notes,
          type: connection.type,
        });
      }
    }
  });
}

export const knowledgeRouter = tsr
  .platformContext<PlatformContext>()
  .routerBuilder(knowledgeContract)
  .routeWithMiddleware("postKnowledge", (routerBuilder) =>
    routerBuilder
      .middleware<TSRAuthContext>(authMiddleware)
      .handler(async ({ body }, { request: { user } }) => {
        await createKnowledge({ knowledge: body, authUserId: user.id });
        return Promise.resolve({
          status: 200,
          body: {
            name: user.name,
            username: user.username,
          },
        });
      }),
  );
