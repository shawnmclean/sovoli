import type { OrgWebsite } from "~/modules/websites/types";
import { ORG_DOMAINS, ORG_USERNAME } from "./constants";

export const MODERN_ACADEMY_WEBSITE: OrgWebsite = {
  title: "Modern Academy – Georgetown, Guyana",
  description: "A top private school offering nursery and primary education.",
  url: `https://${ORG_USERNAME}.sovoli.com`,
  domains: ORG_DOMAINS,
  images: [
    {
      url: `/orgs/${ORG_USERNAME}/websites/landing/hero.jpg`,
      width: 1200,
      height: 600,
      alt: "School front",
    },
  ],
};
