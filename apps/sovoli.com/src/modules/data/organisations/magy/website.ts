import type { Website } from "~/modules/websites/types";
import { ORG_DOMAIN, ORG_USERNAME } from "./constants";

export const MODERN_ACADEMY_WEBSITE: Website = {
  siteName: "Modern Academy",
  title:
    "Modern Academy – Private Nursery, Primary & Secondary School in Guyana",
  description:
    "Modern Academy is a leading private school in Mon Repos, Guyana, offering high-quality nursery, primary and secondary education focused on academic excellence and personal growth.",
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
};
