import type { WebsiteModule } from "~/modules/websites/types";
import { ORG_DOMAIN, ORG_USERNAME } from "./constants";

export const MODERN_ACADEMY_WEBSITE: WebsiteModule = {
  website: {
    siteName: "Modern Academy",
    title: "Private Nursery & Primary School in Guyana - Modern Academy",
    description:
      "Modern Academy is a top private and nursery school in Mon Repos Guyana, offering high-quality education from early childhood playschool to secondary level.",
    url: `https://${ORG_DOMAIN}`,
    domain: ORG_DOMAIN,
    images: [
      {
        url: `/orgs/${ORG_USERNAME}/websites/landing/hero.jpg`,
        width: 1200,
        height: 600,
        alt: "School front",
      },
    ],
  },
};
