"use server";

import type { PutKnowledgeSchemaRequest } from "@sovoli/api/services";
import { updateKnowledge } from "@sovoli/api/services";
import { auth } from "@sovoli/auth";

export interface UpdateKnowledgeActionOptions {
  knowledge: PutKnowledgeSchemaRequest & { id: string };
}
export const updateKnowledgeAction = async ({
  knowledge,
}: UpdateKnowledgeActionOptions) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }
  const updatedKnowledge = await updateKnowledge({
    authUserId: session.user.id,
    knowledgeId: knowledge.id,
    knowledge: knowledge,
  });

  return updatedKnowledge;
};
