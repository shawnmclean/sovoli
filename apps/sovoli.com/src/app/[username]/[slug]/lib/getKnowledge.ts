import { cache } from "react";

import "server-only";

import { notFound, permanentRedirect } from "next/navigation";

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

    // see: https://stackoverflow.com/questions/76191324/next-13-4-error-next-redirect-in-api-routes
    let redirectPath: string | null = null;
    try {
      const knowledgeResponse = await getKnowledgeBySlug({
        username: username,
        authUserId: session?.user?.id,
        slugOrId: slug,
        page,
        pageSize,
      });

      if (
        knowledgeResponse.knowledge.id === slug &&
        knowledgeResponse.knowledge.slug
      ) {
        redirectPath = `/${username}/${knowledgeResponse.knowledge.slug}`;
      }

      return knowledgeResponse;
    } catch (e) {
      console.log(JSON.stringify(e, null, 2));
      return notFound();
    } finally {
      if (redirectPath) {
        permanentRedirect(redirectPath);
      }
    }
  },
);
