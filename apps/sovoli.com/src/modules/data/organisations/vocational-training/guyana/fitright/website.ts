import type { PageConfig, WebsiteModule } from "~/modules/websites/types";
import { ORG_DOMAIN, ORG_USERNAME } from "./constants";

const HOME_PAGE: PageConfig = {
  name: "home",
  title: "Welcome to Fit Right Academy",
  subtitle: "Where craft meets excellence in fashion and education.",
  sections: [
    {
      type: "hero",
      layout: "default",
      variant: "image",
      title: "Master the Art of Dressmaking and Design",
      subtitle:
        "Learn tailoring, fashion design, and professional alterations in a modern, hands-on academy.",
      backgroundImage:
        "/orgs/vocational-training/guyana/fitright/website/home/hero.webp",
      actions: [
        { label: "Apply Now", href: "/academics/apply" },
        { label: "Schedule a Visit", href: "/academics/apply" },
      ],
    },
    {
      type: "programs",
    },
  ],
};

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
          key: "workforce",
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
    pages: [HOME_PAGE],
  },
};
