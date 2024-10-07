import type { MetadataRoute } from "next";
import { db, eq, schema } from "@sovoli/db";

import { getBaseUrl } from "~/utils/getBaseUrl";

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
      slug: true,
    },
    where: eq(schema.Knowledge.isOrigin, true),
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
      url: `${baseUrl}/${knowledge.User.username}/${knowledge.slug}`,
      lastModified: new Date(),
    })),
  ];
}
