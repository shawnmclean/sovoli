import { cache } from "react";
import { unstable_cache } from "next/cache";

import "server-only";

import { auth } from "~/core/auth";
import { GetKnowledgeBySlugOrId } from "~/services/knowledge/getKnowledgeBySlugOrId";

export const preload = (username: string, slugOrId: string) => {
  void getKnowledgeBySlugOrId(username, slugOrId);
};

const getCachedKnowledgeBySlugOrId = unstable_cache(
  async (username: string, slugOrId: string, authUserId?: string) => {
    const getKnowledgeBySlugOrId = new GetKnowledgeBySlugOrId();

    const response = await getKnowledgeBySlugOrId.call({
      username,
      slugOrId,
      authUserId,
    });

    if (!response.knowledge) return null;

    return response;
  },
  ["knowledge"],
);

export const getKnowledgeBySlugOrId = cache(
  async (username: string, slugOrId: string) => {
    const session = await auth();

    return await getCachedKnowledgeBySlugOrId(
      username,
      slugOrId,
      session?.user?.id,
    );
  },
);
