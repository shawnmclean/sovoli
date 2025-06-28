import type { MetadataRoute } from "next";
import { and, db, eq, isNotNull, ne, schema } from "@sovoli/db";

import { getBaseUrl } from "~/utils/getBaseUrl";
import { ORGS } from "~/modules/data/organisations";
import { bus } from "~/services/core/bus";
import { GetAllCategoryAddressesQuery } from "~/modules/organisations/services/queries/GetAllCategoryAddresses";
import { countryCodeToName } from "~/utils/countryUtils";

export const dynamic = "force-dynamic";

// Generate static marketing pages
function generateStaticPages(
  baseUrl: string,
  now: Date,
): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      lastModified: now,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: now,
    },
  ];
}

// Generate user URLs from database
async function generateUserUrls(
  baseUrl: string,
  now: Date,
): Promise<MetadataRoute.Sitemap> {
  // Get all public users with their knowledge items
  const usersWithKnowledge = await db.query.User.findMany({
    with: {
      KnowledgeResources: {
        where: eq(schema.Knowledge.isPublic, true),
        columns: {
          id: true,
          slug: true,
          type: true,
        },
      },
    },
    columns: {
      username: true,
    },
    where: and(isNotNull(schema.User.username), ne(schema.User.username, "")),
  });

  const userUrls: MetadataRoute.Sitemap = [];

  for (const user of usersWithKnowledge) {
    if (!user.username) continue;

    // User profile page
    userUrls.push({
      url: `${baseUrl}/${user.username}`,
      lastModified: now,
    });

    // User shelves page
    userUrls.push({
      url: `${baseUrl}/${user.username}/shelves`,
      lastModified: now,
    });

    // User collections page
    userUrls.push({
      url: `${baseUrl}/${user.username}/collections`,
      lastModified: now,
    });

    // Individual knowledge items
    for (const knowledge of user.KnowledgeResources) {
      const slug = knowledge.slug ?? knowledge.id;
      userUrls.push({
        url: `${baseUrl}/${user.username}/${slug}`,
        lastModified: now,
      });
    }
  }

  return userUrls;
}

// Generate organization URLs from static data
function generateOrganizationUrls(
  baseUrl: string,
  now: Date,
): MetadataRoute.Sitemap {
  const organizationUrls: MetadataRoute.Sitemap = [];

  for (const org of ORGS) {
    const username = org.org.username;

    // Main organization profile page
    organizationUrls.push({
      url: `${baseUrl}/orgs/${username}`,
      lastModified: now,
    });

    // Organization scores page
    organizationUrls.push({
      url: `${baseUrl}/orgs/${username}/scores`,
      lastModified: now,
    });

    // Organization logs page
    organizationUrls.push({
      url: `${baseUrl}/orgs/${username}/logs`,
      lastModified: now,
    });
  }

  return organizationUrls;
}

// Generate directory URLs from static data
async function generateDirectoryUrls(
  baseUrl: string,
  now: Date,
): Promise<MetadataRoute.Sitemap> {
  const directoryUrls: MetadataRoute.Sitemap = [];

  const categoryAddresses = await bus.queryProcessor.execute(
    new GetAllCategoryAddressesQuery(),
  );

  // Generate URLs for each category-location combination
  for (const categoryAddress of categoryAddresses.categoryAddresses) {
    const country = countryCodeToName(categoryAddress.address.countryCode);
    if (!country) continue;

    // Country-level directory
    directoryUrls.push({
      url: `${baseUrl}/d/${categoryAddress.category}/${country.toLowerCase()}`,
      lastModified: now,
    });

    // TODO: When we figure out how to handle search/seo for location
    // // State-level directory (if state exists)
    // if (categoryAddress.address.state) {
    //   directoryUrls.push({
    //     url: `${baseUrl}/d/${categoryAddress.category}/${country}/${categoryAddress.address.state}`,
    //     lastModified: now,
    //   });
    // }

    // // City-level directory (if city exists)
    // if (categoryAddress.address.city) {
    //   directoryUrls.push({
    //     url: `${baseUrl}/d/${categoryAddress.category}/${country}/${categoryAddress.address.city}`,
    //     lastModified: now,
    //   });
    // }
  }

  return directoryUrls;
}

export default async function Sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const now = new Date();

  const [staticPages, userUrls, organizationUrls, directoryUrls] =
    await Promise.all([
      Promise.resolve(generateStaticPages(baseUrl, now)),
      generateUserUrls(baseUrl, now),
      Promise.resolve(generateOrganizationUrls(baseUrl, now)),
      generateDirectoryUrls(baseUrl, now),
    ]);

  return [...staticPages, ...userUrls, ...organizationUrls, ...directoryUrls];
}
