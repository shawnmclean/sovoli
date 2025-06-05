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
    header: {
      layout: "default",
      variant: "default",
      nav: [
        {
          key: "home",
          label: "Home",
        },
        {
          key: "about",
          label: "About",
        },
        {
          key: "academics",
          label: "Programs",
        },
        {
          key: "team",
          label: "Team",
        },
        {
          key: "gallery",
          label: "Gallery",
        },
        {
          key: "contact",
          label: "Contact",
        },
      ],
      actions: [
        {
          key: "apply",
          label: "Apply Now",
        },
      ],
    },
    footer: {
      layout: "default",
      variant: "default",
      sections: [
        {
          key: "social",
          title: "Modern Academy",
          description:
            "Empowering students to reach their full potential through innovative education.",
        },
        {
          key: "academics",
          title: "Programs",
        },
        {
          key: "other",
          title: "Resources",
          links: [
            {
              label: "Account Portal",
              url: "#",
            },
            {
              label: "Academic Calendar",
              url: "#",
            },
          ],
        },
        {
          key: "contact",
          title: "Contact",
        },
      ],
    },
  },
};
