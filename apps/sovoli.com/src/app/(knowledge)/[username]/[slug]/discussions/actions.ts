"use server";

import type { PutKnowledgeSchemaRequest } from "@sovoli/core/services";
import { auth } from "@sovoli/auth";
import { updateKnowledge } from "@sovoli/core/services";

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
