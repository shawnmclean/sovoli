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
        "Fit Right offers premium tailoring services and hands-on vocational training in fashion design and alterations.",
      backgroundImage:
        "/vocational-training/guyana/fitright/website/home/hero.webp",
      actions: [
        { label: "Apply Now", href: "/programs" },
        { label: "Schedule a Visit", href: "/programs" },
      ],
    },
    {
      type: "programs",
      title: "Our Programs",
      subtitle:
        "Explore our comprehensive range of programs designed to equip you with the skills and knowledge to excel in the fashion and tailoring industry.",
    },
  ],
};

export const FITRIGHT_ACADEMY_WEBSITE: WebsiteModule = {
  website: {
    siteName: "Fit Right",
    title: "Dressmaking, Alterations & Academic Programs - Fit Right",
    description:
      "Fit Right specializes in dressmaking, alterations, and offers a range of academic programs, providing quality education and tailoring services.",
    url: `https://${ORG_DOMAIN}`,
    domain: ORG_DOMAIN,
    images: [
      {
        url: `/${ORG_USERNAME}/websites/landing/hero.jpg`,
        width: 1200,
        height: 600,
        alt: "Fit Right front or logo",
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
          title: "Fit Right",
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
