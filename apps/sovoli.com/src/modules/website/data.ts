import type { OrgMeta } from "./types";

export const orgs: OrgMeta[] = [
  {
    name: "Modern Academy",
    title: "Modern Academy: The Best Private School in Guyana",
    description: "The Modern Academy private school",
    slug: "magy",
    country: "Guyana",
    city: "Georgetown",
    address: "123 Main Street",
    contacts: [
      {
        email: "info@magy.academy",
        phone: "1234567890",
      },
    ],
    url: "https://www.ma.edu.gy",
    images: [
      {
        url: "/images/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Modern Academy: Best Private School in Guyana",
      },
    ],
    customDomains: ["ma.edu.gy", "www.ma.edu.gy"],
  },
  {
    name: "Xav Dress",
    title: "Xav Dressmaking",
    description: "Xav Dress",
    slug: "xav",
    country: "Guyana",
    city: "Georgetown",
    address: "123 Main Street",
    contacts: [
      {
        email: "info@magy.academy",
        phone: "1234567890",
      },
    ],
    url: "https://xav.sovoli.com",
    images: [
      {
        url: "/images/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Sovoli: A Lifelong Knowledge System",
      },
    ],
  },
];
