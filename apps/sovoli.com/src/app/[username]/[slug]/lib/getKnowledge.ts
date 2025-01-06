import { cache } from "react";

import "server-only";

import { auth } from "~/core/auth";
import { getKnowledgeBySlug } from "./getKnowledgeService";

interface GetnowledgeOptions {
  params: { username: string; slug: string };
  searchParams: { page: number | undefined; pageSize: number | undefined };
}

export const preload = (options: GetnowledgeOptions) => {
  void retreiveKnowledgeBySlug(options);
};

export const retreiveKnowledgeBySlug = cache(
  async ({
    params: { username, slug },
    searchParams: { page, pageSize },
  }: GetnowledgeOptions) => {
    const session = await auth();

    return await getKnowledgeBySlug({
      username: username,
      authUserId: session?.user?.id,
      slugOrId: slug,
      page,
      pageSize,
    });
  },
);
