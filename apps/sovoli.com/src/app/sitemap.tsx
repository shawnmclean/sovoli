import type { MetadataRoute } from "next";
import { getBaseUrl } from "@sovoli/api/utils";
import { and, db, eq, schema } from "@sovoli/db";

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
    where: and(eq(schema.Knowledge.isPrivate, false)),
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
