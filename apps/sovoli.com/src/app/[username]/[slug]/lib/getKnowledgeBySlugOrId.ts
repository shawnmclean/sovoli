import { cache } from "react";

import "server-only";

import { auth } from "~/core/auth";
import { GetKnowledgeBySlugOrId } from "~/services/knowledge/getKnowledgeBySlugOrId";

export const preload = (username: string, slugOrId: string) => {
  void getKnowledgeBySlugOrId(username, slugOrId);
};

export const getKnowledgeBySlugOrId = cache(
  async (username: string, slugOrId: string) => {
    const session = await auth();

    const getKnowledgeBySlugOrId = new GetKnowledgeBySlugOrId();

    const response = await getKnowledgeBySlugOrId.call({
      username,
      slugOrId,
      authUserId: session?.userId,
    });

    if (!response.knowledge) return null;

    return response;
  },
);
