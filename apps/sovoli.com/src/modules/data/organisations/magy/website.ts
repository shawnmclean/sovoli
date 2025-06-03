import type { OrgWebsite } from "~/modules/websites/types";
import { ORG_USERNAME } from "./constants";

export const MODERN_ACADEMY_WEBSITE: OrgWebsite = {
  title: "Modern Academy – Georgetown, Guyana",
  description: "A top private school offering nursery and primary education.",
  url: `https://${ORG_USERNAME}.sovoli.com`,
  customDomains: ["ma.edu.gy"],
  images: [
    {
      url: `/orgs/${ORG_USERNAME}/website/landing/hero.jpg`,
      width: 1200,
      height: 600,
      alt: "School front",
    },
  ],
};
