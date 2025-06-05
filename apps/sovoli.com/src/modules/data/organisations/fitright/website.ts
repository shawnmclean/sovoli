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
    header: {
      layout: "default",
      variant: "default",
      nav: [
        {
          key: "home",
          label: "Home",
        },
        {
          key: "academics",
          label: "Academics",
        },
        {
          key: "offerings",
          label: "Services",
        },
        {
          key: "team",
          label: "Team",
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
          title: "Fit Right Academy",
          description:
            "Empowering students to reach their full potential through innovative education.",
        },
        {
          key: "academics",
          title: "Programs",
        },
        {
          key: "offerings",
          title: "Offerings",
        },
        {
          key: "contact",
          title: "Contact",
        },
      ],
    },
  },
};
