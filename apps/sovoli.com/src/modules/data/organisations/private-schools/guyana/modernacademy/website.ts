import type { PageConfig, WebsiteModule } from "~/modules/websites/types";
import { ORG_DOMAIN, ORG_USERNAME } from "./constants";

const ABOUT_PAGE: PageConfig = {
  name: "about",
  title: "About Us",
  subtitle:
    "Learn more about our vision, mission, and the values that guide us",

  sections: [
    {
      type: "hero",
      layout: "condensed",
      variant: "image",
      title: "About Us",
      subtitle: "Guyana's Fastest Growing Private Institution",
      backgroundImage: "https://img.heroui.chat/image/places?w=1920&h=600&u=2",
    },
  ],
};

const HOME_PAGE: PageConfig = {
  name: "home",
  title: "Welcome to Modern Academy",
  subtitle: "Empowering Minds, Shaping Futures",

  sections: [
    {
      type: "hero",
      layout: "default",
      variant: "image",
      title: "Empowering Minds, Shaping Futures",
      subtitle:
        "Join a community dedicated to academic excellence and personal growth",
      backgroundImage: "/images/hero.jpg",
      actions: [
        { label: "Apply Now", href: "/academics/apply" },
        { label: "Schedule a Visit", href: "/academics/apply" },
      ],
    },
    {
      type: "metrics",
    },
    {
      type: "programs",
      title: "Our Programs",
      subtitle:
        "Our programs are designed to provide a nurturing environment that fosters academic excellence, character development, and lifelong learning.",
    },
    {
      type: "team",
      title: "Meet Our Team",
      subtitle:
        "Our dedicated faculty and staff are committed to providing the highest quality education and support for all students.",
    },
    {
      type: "cards",
      title: "The First Principles",
      subtitle:
        "Guiding principles that shape our approach to education and community building",
    },
  ],
};

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
          key: "workforce",
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
    pages: [HOME_PAGE, ABOUT_PAGE],
  },
};
