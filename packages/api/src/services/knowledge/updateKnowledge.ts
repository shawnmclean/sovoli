import type { SQL } from "@sovoli/db";
import type {
  InsertMediaAssetSchema,
  SelectKnowledgeSchema,
  SelectMediaAssetSchema,
} from "@sovoli/db/schema";
import { and, db, eq, inArray, schema, sql } from "@sovoli/db";
import {
  knowledgeConnectionTypeEnum,
  MediaAssetHost,
  UserType,
} from "@sovoli/db/schema";

import type {
  PutKnowledgeSchemaRequest,
  UpdateConnectionSchema,
} from "../../tsr/router/knowledge/knowledgeContract";
import { hydrateKnowledge, hydrateMedia } from "../../trigger";
import { hashAuthToken } from "../../utils/authTokens";
import { createConnections } from "./createConnections";

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
  // Filter out connections that don't have an id (i.e., connections being added)
  const mutationConnectionIds = knowledge.connections
    ?.filter((c) => c.action !== "add") // Only keep connections that are not "add"
    .map((c) => c.id);

  const knowledgeToUpdate = await db.query.Knowledge.findFirst({
    with: {
      User: {
        columns: { id: true, type: true },
      },
      SourceConnections: {
        where: inArray(
          schema.KnowledgeConnection.id,
          mutationConnectionIds ?? [],
        ),
      },
    },
    where: and(
      eq(schema.Knowledge.id, knowledgeId),
      eq(schema.Knowledge.userId, authUserId),
    ),
  });

  // #region Auth Checks

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

  // check that all connections are in the knowledgeToUpdate.SourceConnections
  // if any is missing, throw an error that the connection is not found as part of the knowledge
  const sourceConnectionIds = knowledgeToUpdate.SourceConnections.map(
    (conn) => conn.id,
  );
  const invalidIds = mutationConnectionIds?.filter(
    (id) => !sourceConnectionIds.includes(id),
  );

  // If there are invalid ids, throw an error
  if (invalidIds && invalidIds.length > 0) {
    throw new Error(
      `Invalid connection(s): ${invalidIds.join(", ")} are not part of the current knowledge.`,
    );
  }

  // #endregion

  let updatedKnowledge: SelectKnowledgeSchema = {
    ...knowledgeToUpdate,
    MediaAssets: [],
    SourceConnections: [],
  };

  const fieldsToUpdate = Object.fromEntries(
    Object.entries({
      title: knowledge.title,
      description: knowledge.description,
      content: knowledge.content,
      context: knowledge.context,
      contextDescription: knowledge.contextDescription,
      type: knowledge.type,
      isPrivate: knowledge.iaPrivate,
    }).filter(([_, value]) => value !== undefined),
  );

  if (Object.keys(fieldsToUpdate).length > 0) {
    const updatedKnowledges = await db
      .update(schema.Knowledge)
      .set(fieldsToUpdate)
      .where(eq(schema.Knowledge.id, knowledgeId))
      .returning();
    if (!updatedKnowledges[0]) {
      throw Error("Knowledge not found/updated");
    }
    // Merge the database updated fields back into updatedKnowledge
    updatedKnowledge = {
      ...updatedKnowledge,
      ...updatedKnowledges[0], // merge updated values from DB
    };
  }

  if (knowledge.connections) {
    const connectionsToUpdate = knowledge.connections.filter(
      (c) => c.action === "update",
    );
    const connectionsToInsert = knowledge.connections.filter(
      (c) => c.action === "add",
    );
    const connectionsToDelete = knowledge.connections.filter(
      (c) => c.action === "remove",
    );

    const [updatedConnections, createdConnections] = await Promise.all([
      // TODO: we may want to update all child connections, such as if the parent privacy changes, all child connections should be updated (if they were created as part of the origin)
      updateConnections(connectionsToUpdate),
      createConnections({
        parentKnowledge: updatedKnowledge,
        authUserId,
        connections: connectionsToInsert,
      }),
      db.delete(schema.KnowledgeConnection).where(
        inArray(
          schema.KnowledgeConnection.id,
          connectionsToDelete.map((c) => c.id),
        ),
      ),
    ]);

    updatedKnowledge.SourceConnections = [
      ...updatedKnowledge.SourceConnections,
      ...createdConnections,
      ...updatedConnections,
    ];
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

  const assetsToDelete: SelectMediaAssetSchema[] = [];
  // if there are media assets in delete, remove those
  if (knowledge.assets) {
    const assetToDeleteIds = knowledge.assets.filter(
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      (c) => c.action === "remove",
    );

    const deletedAssets = await db
      .update(schema.MediaAsset)
      .set({ delete: true })
      .where(
        inArray(
          schema.MediaAsset.id,
          assetToDeleteIds.map((c) => c.id),
        ),
      )
      .returning();

    assetsToDelete.push(...deletedAssets);
  }

  const triggerPromises = [];
  if (updatedKnowledge.SourceConnections.length > 0) {
    const hydrateKnowledgePromise = hydrateKnowledge.batchTrigger([
      { payload: { knowledgeId: updatedKnowledge.id } }, // add the source knowledge to the queue
      ...updatedKnowledge.SourceConnections.map((connection) => ({
        // add the connections to the queue, even if they belong to someone else or is hydrated already, its a tradeoff
        payload: { knowledgeId: connection.targetKnowledgeId },
      })),
    ]);

    triggerPromises.push(hydrateKnowledgePromise);
  }
  if (updatedKnowledge.MediaAssets.length > 0 || assetsToDelete.length > 0) {
    const hydrateMediaPromise = hydrateMedia.batchTrigger([
      ...assetsToDelete.map((asset) => ({
        payload: { mediaId: asset.id },
      })),
      ...updatedKnowledge.MediaAssets.map((asset) => ({
        payload: { mediaId: asset.id },
      })),
    ]);
    triggerPromises.push(hydrateMediaPromise);
  }

  await Promise.all(triggerPromises);

  return updatedKnowledge;
};

const updateConnections = async (connections: UpdateConnectionSchema[]) => {
  if (connections.length === 0) {
    return [];
  }

  const ids: string[] = connections.map((input) => input.id);

  const sqlChunksForNotes: SQL[] = [sql`(case`];
  const sqlChunksForType: SQL[] = [sql`(case`];
  const sqlChunksForMetadata: SQL[] = [sql`(case`];
  const sqlChunksForOrder: SQL[] = [sql`(case`];

  for (const input of connections) {
    if (input.notes !== undefined) {
      sqlChunksForNotes.push(
        sql`when ${schema.KnowledgeConnection.id} = ${input.id} then ${input.notes}`,
      );
    }

    if (input.type !== undefined) {
      sqlChunksForType.push(
        sql`when ${schema.KnowledgeConnection.id} = ${input.id} then ${input.type}::${sql.raw(knowledgeConnectionTypeEnum.enumName)}`,
      );
    }

    if (input.metadata !== undefined) {
      sqlChunksForMetadata.push(
        sql`when ${schema.KnowledgeConnection.id} = ${input.id} then ${input.metadata}::jsonb`,
      );
    }

    if (input.order !== undefined) {
      sqlChunksForOrder.push(
        sql`when ${schema.KnowledgeConnection.id} = ${input.id} then ${input.order}::integer`,
      );
    }
  }

  sqlChunksForNotes.push(sql`end)`);
  sqlChunksForType.push(sql`end)`);
  sqlChunksForMetadata.push(sql`end)`);
  sqlChunksForOrder.push(sql`end)`);

  // join the chunks, if there less than 3, (case and end) then keep as undefined so we don't set that
  const finalNotesSql =
    sqlChunksForNotes.length > 2
      ? sql.join(sqlChunksForNotes, sql.raw(" "))
      : undefined;
  const finalTypeSql =
    sqlChunksForType.length > 2
      ? sql.join(sqlChunksForType, sql.raw(" "))
      : undefined;
  const finalMetadataSql =
    sqlChunksForMetadata.length > 2
      ? sql.join(sqlChunksForMetadata, sql.raw(" "))
      : undefined;

  const finalOrderSql =
    sqlChunksForOrder.length > 2
      ? sql.join(sqlChunksForOrder, sql.raw(" "))
      : undefined;

  const updatedKnowledgeConnections = await db
    .update(schema.KnowledgeConnection)
    .set({
      notes: finalNotesSql,
      type: finalTypeSql,
      metadata: finalMetadataSql,
      order: finalOrderSql,
    })
    .where(inArray(schema.KnowledgeConnection.id, ids))
    .returning();

  return updatedKnowledgeConnections;
};
