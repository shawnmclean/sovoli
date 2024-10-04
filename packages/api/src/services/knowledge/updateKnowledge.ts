import type { SelectKnowledgeSchema } from "@sovoli/db/schema";
import { and, db, eq, inArray, schema } from "@sovoli/db";
import { UserType } from "@sovoli/db/schema";

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

  // update/ add connections
  if (knowledge.connections) {
    // TODO: add connections
    // await db.insert(schema.KnowledgeConnection).values(knowledge.connections);
  }

  // update/ add media assets
  if (knowledge.openaiFileIdRefs) {
    // TODO: add media assets
    // await db.insert(schema.MediaAsset).values(knowledge.mediaAssets);
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
