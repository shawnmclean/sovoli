import { and, db, eq, schema } from "@sovoli/db";

import type { PutKnowledgeSchemaRequest } from "../../tsr/router/knowledge/knowledgeContract";

export interface CreateKnowledgeOptions {
  authUserId: string;
  knowledgeId: string;
  knowledge: PutKnowledgeSchemaRequest;
}

export const updateKnowledge = async ({
  authUserId,
  knowledgeId,
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

  // Destructure the User object from the result to exclude it
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { User, ...knowledgeWithoutUser } = knowledgeToUpdate;

  return knowledgeWithoutUser;
};
