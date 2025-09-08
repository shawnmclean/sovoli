import type { PageConfig, WebsiteModule } from "~/modules/websites/types";
import { ORG_DOMAIN, ORG_USERNAME } from "./constants";

const HOME_PAGE: PageConfig = {
  name: "home",
  title: "Welcome to Creative Thinking Stationery Hub",
  subtitle:
    "Your one-stop destination for quality stationery and office supplies.",
  sections: [
    {
      type: "hero",
      layout: "default",
      variant: "image",
      title: "Quality Stationery for Every Need",
      subtitle:
        "Creative Thinking Stationery Hub offers a comprehensive range of stationery, office supplies, and educational materials to support your learning and work needs.",
      backgroundImage:
        "/orgs/stationary/guyana/creativethinking/website/home/hero.webp",
      actions: [
        { label: "View Products", href: "/offerings" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
    {
      type: "cards",
      title: "Our Products",
      subtitle:
        "Explore our wide selection of stationery items, office supplies, and educational materials designed to meet your every need.",
    },
  ],
};

export const CREATIVE_THINKING_STATIONERY_HUB_WEBSITE: WebsiteModule = {
  website: {
    siteName: "Creative Thinking Stationery Hub",
    title: "Stationery & Office Supplies - Creative Thinking Stationery Hub",
    description:
      "Creative Thinking Stationery Hub provides quality stationery, office supplies, and educational materials in Guyana. Your trusted partner for all stationery needs.",
    url: `https://${ORG_DOMAIN}`,
    domain: ORG_DOMAIN,
    images: [
      {
        url: `/orgs/${ORG_USERNAME}/websites/landing/hero.jpg`,
        width: 1200,
        height: 600,
        alt: "Creative Thinking Stationery Hub storefront",
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
          key: "offerings",
          label: "Products",
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
          key: "contact",
          label: "Contact Us",
        },
      ],
    },
    footer: {
      layout: "default",
      variant: "default",
      sections: [
        {
          key: "social",
          title: "Creative Thinking Stationery Hub",
          description:
            "Your trusted partner for quality stationery and office supplies in Guyana.",
        },
        {
          key: "offerings",
          title: "Products",
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
