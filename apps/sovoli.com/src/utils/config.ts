import { env } from "~/env";

export const config = {
  title: "Sovoli: A Lifelong Knowledge System",
  siteName: "Sovoli",
  description:
    "Sovoli is a lifelong knowledge system developed in collaboration with private schools. Starting in Guyana and Jamaica, Sovoli helps schools and students record, share, and continue learning across every stage of life — from early education to mastery.",
  url: "https://sovoli.com",
  images: [
    {
      url: "/images/og-image.webp",
      width: 1200,
      height: 630,
      alt: "Sovoli: A Lifelong Knowledge System",
    },
  ],
  rootDomain: env.NODE_ENV === "development" ? "localhost:3000" : "sovoli.com",
};
