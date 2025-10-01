import type { MetadataRoute } from "next";

import { getBaseUrl } from "~/utils/getBaseUrl";
import { ORGS } from "~/modules/data/organisations";
import { bus } from "~/services/core/bus";
import { GetAllCategoryAddressesQuery } from "~/modules/organisations/services/queries/GetAllCategoryAddresses";
import { countryCodeToName } from "~/utils/countryUtils";
import {
  GetUserKnowledgeByUsernameQuery,
  GetUserKnowledgeByUsernameQueryHandler,
} from "~/modules/notes/services/GetUserKnowledgeByUsername";
import { KnowledgeFileCache } from "~/modules/notes/services/KnowledgeFileCache";

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

// Generate user URLs from knowledge files
async function generateUserUrls(
  baseUrl: string,
  now: Date,
): Promise<MetadataRoute.Sitemap> {
  const userUrls: MetadataRoute.Sitemap = [];
  const userKnowledgeHandler = new GetUserKnowledgeByUsernameQueryHandler();
  const cache = KnowledgeFileCache.getInstance();

  // Ensure cache is loaded
  await cache.loadAllFiles();

  // Get all unique usernames from the cache
  const userSlugs = cache.getUserSlugs();
  const uniqueUsernames = [...new Set(userSlugs.map((us) => us.username))];

  for (const username of uniqueUsernames) {
    // Check if user has knowledge using the handler
    const userKnowledgeResult = await userKnowledgeHandler.handle(
      new GetUserKnowledgeByUsernameQuery(username),
    );

    if (userKnowledgeResult.userKnowledge) {
      const { knowledgeItems } = userKnowledgeResult.userKnowledge;

      // User profile page
      userUrls.push({
        url: `${baseUrl}/${username}`,
        lastModified: now,
      });

      // Individual knowledge items
      for (const knowledge of knowledgeItems) {
        userUrls.push({
          url: `${baseUrl}/${username}/${knowledge.slug}`,
          lastModified: now,
        });
      }
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
      url: `${baseUrl}/${username}`,
      lastModified: now,
    });

    // Organization scores page
    organizationUrls.push({
      url: `${baseUrl}/${username}/scores`,
      lastModified: now,
    });

    // Organization logs page
    organizationUrls.push({
      url: `${baseUrl}/${username}/logs`,
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
