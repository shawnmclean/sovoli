import type { WebsiteModule } from "~/modules/websites/types";
import { ORG_DOMAIN, ORG_USERNAME } from "./constants";

export const FITRIGHT_ACADEMY_WEBSITE: WebsiteModule = {
  website: {
    siteName: "Fit Right Academy",
    title: "Dressmaking, Alterations & Academic Programs - Fit Right Academy",
    description:
      "Fit Right Academy specializes in dressmaking, alterations, and offers a range of academic programs, providing quality education and tailoring services.",
    url: `https://${ORG_DOMAIN}`,
    domain: ORG_DOMAIN,
    images: [
      {
        url: `/orgs/${ORG_USERNAME}/websites/landing/hero.jpg`,
        width: 1200,
        height: 600,
        alt: "Fit Right Academy front or logo",
      },
    ],
  },
};
