import type {
  InsertMediaAssetSchema,
  SelectKnowledgeSchema,
} from "@sovoli/db/schema";
import { and, db, eq, inArray, schema } from "@sovoli/db";
import { MediaAssetHost, UserType } from "@sovoli/db/schema";

import type { PutKnowledgeSchemaRequest } from "../../tsr/router/knowledge/knowledgeContract";
import { hashAuthToken } from "../../utils/authTokens";
import { createConnections } from "./createConnections";
import { updateConnections } from "./updateConnections";

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
      updateConnections({
        connections: connectionsToUpdate,
      }),
      createConnections({
        sourceKnowledgeId: updatedKnowledge.id,
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
