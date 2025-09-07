import type { PageConfig, WebsiteModule } from "~/modules/websites/types";
import { ORG_DOMAIN } from "./constants";

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
      subtitle: "Nurturing Young Minds in the Heart of St. Elizabeth",
      backgroundImage: "https://img.heroui.chat/image/places?w=1920&h=600&u=3",
    },
  ],
};

const HOME_PAGE: PageConfig = {
  name: "home",
  title: "Welcome to Appleton Basic School",
  subtitle: "Nurturing Young Minds, Building Bright Futures",

  sections: [
    {
      type: "hero",
      layout: "default",
      variant: "image",
      title: "Nurturing Young Minds, Building Bright Futures",
      subtitle:
        "Join our community dedicated to providing quality early childhood education in the heart of St. Elizabeth",
      backgroundImage:
        "/orgs/private-schools/jamaica/appleton/website/home/hero.webp",
      actions: [
        { label: "Apply Now", href: "/programs" },
        { label: "Schedule a Visit", href: "/programs" },
      ],
    },
    {
      type: "programs",
      title: "Our Programs",
      subtitle:
        "Our nursery programs are designed to provide a nurturing environment that fosters early learning, social development, and school readiness.",
    },
    {
      type: "team",
      title: "Meet Our Team",
      subtitle:
        "Our dedicated teachers and staff are committed to providing the highest quality early childhood education and care for all students.",
    },
    {
      type: "cards",
      title: "Why Choose Appleton Basic School",
      subtitle:
        "Discover what makes our school the perfect place for your child's early learning journey",
    },
  ],
};

export const APPLETON_BASIC_SCHOOL_WEBSITE: WebsiteModule = {
  website: {
    siteName: "Appleton Basic School",
    title:
      "Private Nursery School in St. Elizabeth, Jamaica - Appleton Basic School",
    description:
      "Appleton Basic School is a private nursery school in Appleton Estate, St. Elizabeth, Jamaica, offering quality early childhood education for children ages 3-5.",
    url: `https://${ORG_DOMAIN}`,
    domain: ORG_DOMAIN,
    images: [
      {
        url: "/orgs/private-schools/jamaica/appleton/website/home/hero.webp",
        width: 1200,
        height: 600,
        alt: "Appleton Basic School front view",
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
          title: "Appleton Basic School",
          description:
            "Nurturing young minds and building bright futures through quality early childhood education.",
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
