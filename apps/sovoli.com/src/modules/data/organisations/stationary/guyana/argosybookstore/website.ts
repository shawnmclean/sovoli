import type { PageConfig, WebsiteModule } from "~/modules/websites/types";
import { ORG_DOMAIN, ORG_USERNAME } from "./constants";

const HOME_PAGE: PageConfig = {
  name: "home",
  title: "Welcome to Argosy Book Store",
  subtitle:
    "Your premier destination for books, stationery, and educational materials in Georgetown, Guyana.",
  sections: [
    {
      type: "hero",
      layout: "default",
      variant: "image",
      title: "Quality Books & Stationery for Every Need",
      subtitle:
        "Argosy Book Store offers a comprehensive range of books, stationery, and educational materials to support your learning and reading needs in Georgetown.",
      backgroundImage:
        "/stationary/guyana/argosybookstore/website/home/hero.webp",
      actions: [
        { label: "Browse Books", href: "/offerings" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
    {
      type: "cards",
      title: "Our Products",
      subtitle:
        "Explore our wide selection of books, stationery items, and educational materials designed to meet your every need.",
    },
  ],
};

export const ARGOSY_BOOK_STORE_WEBSITE: WebsiteModule = {
  website: {
    siteName: "Argosy Book Store",
    title: "Books & Stationery - Argosy Book Store",
    description:
      "Argosy Book Store provides quality books, stationery, and educational materials in Georgetown, Guyana. Your trusted partner for all reading and learning needs.",
    url: `https://${ORG_DOMAIN}`,
    domain: ORG_DOMAIN,
    images: [
      {
        url: `/${ORG_USERNAME}/websites/landing/hero.jpg`,
        width: 1200,
        height: 600,
        alt: "Argosy Book Store storefront",
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
          label: "Books & Products",
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
          title: "Argosy Book Store",
          description:
            "Your trusted partner for quality books and stationery in Georgetown, Guyana.",
        },
        {
          key: "offerings",
          title: "Books & Products",
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
