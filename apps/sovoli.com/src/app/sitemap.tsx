import type { MetadataRoute } from "next";
import { and, db, eq, schema } from "@sovoli/db";

import { getBaseUrl } from "~/utils/getBaseUrl";

export const dynamic = "force-dynamic";

export default async function Sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const originKnowledges = await db.query.Knowledge.findMany({
    with: {
      User: {
        columns: {
          username: true,
        },
      },
    },
    columns: {
      id: true,
      slug: true,
    },
    where: and(eq(schema.Knowledge.isPublic, true)),
  });

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/users`,
      lastModified: new Date(),
    },
    ...originKnowledges.map((knowledge) => ({
      url: `${baseUrl}/${knowledge.User.username}/${knowledge.slug ?? knowledge.id}`,
      lastModified: new Date(),
    })),
  ];
}
