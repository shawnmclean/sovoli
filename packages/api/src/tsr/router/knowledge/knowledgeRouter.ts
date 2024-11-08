import { db } from "@sovoli/db";
import { KnowledgeConnectionType } from "@sovoli/db/schema";
import { tsr } from "@ts-rest/serverless/fetch";

import type { BatchCreateConnectionsOptions } from "../../../services/knowledge/batchCreateConnections";
import type { BatchCreateKnowledgesOptions } from "../../../services/knowledge/batchCreateKnowledges";
import type { PlatformContext, TSRAuthContext } from "../../types";
import { BatchCreateConnections } from "../../../services/knowledge/batchCreateConnections";
import { BatchCreateKnowledges } from "../../../services/knowledge/batchCreateKnowledges";
import { updateKnowledge } from "../../../services/knowledge/updateKnowledge";
import { getBaseUrl } from "../../../utils/getBaseUrl";
import { authMiddleware } from "../authMiddleware";
import { knowledgeContract } from "./knowledgeContract";

export const knowledgeRouter = tsr
  .platformContext<PlatformContext>()
  .routerBuilder(knowledgeContract)
  .routeWithMiddleware("postKnowledge", (routerBuilder) =>
    routerBuilder
      .middleware<TSRAuthContext>(authMiddleware)
      .handler(async ({ body }, { request: { user } }) => {
        const batchCreateKnowledges = new BatchCreateKnowledges(db);
        const batchCreateConnections = new BatchCreateConnections(db);

        const knowledgesToInsert: BatchCreateKnowledgesOptions["knowledges"] = [
          { ...body, isOrigin: true },
        ];
        const connections = body.connections ?? [];

        for (const connection of connections) {
          knowledgesToInsert.push({
            query: connection.targetKnowledge.query,
            type: connection.targetKnowledge.type,
            queryType: connection.targetKnowledge.queryType,
          });
        }

        const createdKnowledges = await batchCreateKnowledges.call({
          authUserId: user.id,
          knowledges: knowledgesToInsert,
        });

        const connectionsToInsert: BatchCreateConnectionsOptions["connections"] =
          [];

        for (let i = 0; i < connections.length; i++) {
          connectionsToInsert.push({
            sourceKnowledgeId: createdKnowledges[0]?.id, // The ID of the original knowledge
            targetKnowledgeId: createdKnowledges[i + 1]?.id, // ID of the corresponding target knowledge
            type: KnowledgeConnectionType.collection,
          });
        }

        // Step 4: Insert all connections in a batch
        await batchCreateConnections.call({
          connections: connectionsToInsert,
        });

        const { knowledge, authToken } = await createKnowledge({
          knowledge: body,
          authUserId: user.id,
        });

        const response = {
          ...knowledge,
          url: `${getBaseUrl()}/${user.username}/${knowledge.slug}`,
          authToken,
        };
        return {
          status: 200,
          body: response,
        };
      }),
  )
  .routeWithMiddleware("putKnowledge", (routerBuilder) =>
    routerBuilder
      .middleware<TSRAuthContext>(authMiddleware)
      .handler(async ({ body, params: { id } }, { request: { user } }) => {
        const knowledge = await updateKnowledge({
          knowledgeId: id,
          knowledge: body,
          authUserId: user.id,
        });

        const response = {
          ...knowledge,
          url: `${getBaseUrl()}/${user.username}/${knowledge.slug}`,
        };
        return {
          status: 200,
          body: response,
        };
      }),
  );
