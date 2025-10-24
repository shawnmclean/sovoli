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
      subtitle: "Excellence in Education, Nurturing Future Leaders",
      backgroundImage: "https://img.heroui.chat/image/places?w=1920&h=600&u=2",
    },
  ],
};

const HOME_PAGE: PageConfig = {
  name: "home",
  title: "Welcome to Bacchus Learning Centre",
  subtitle: "Empowering Minds, Shaping Futures",

  sections: [
    {
      type: "hero",
      layout: "default",
      variant: "image",
      title: "Empowering Minds, Shaping Futures",
      subtitle:
        "Join a community dedicated to academic excellence and personal growth",
      backgroundImage:
        "https://res.cloudinary.com/dipyku9mn/image/upload/v1761265485/o/blcgy/school/park.jpg",
      actions: [
        { label: "Apply Now", href: "/programs" },
        { label: "Schedule a Visit", href: "/programs" },
      ],
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

export const BACCHUS_LEARNING_WEBSITE: WebsiteModule = {
  website: {
    siteName: "Bacchus Learning Centre",
    title:
      "Private Nursery & Primary School in Guyana - Bacchus Learning Centre",
    description:
      "Bacchus Learning Centre is a top private school in Campbellville, Georgetown, offering high-quality education from nursery to secondary level.",
    url: `https://${ORG_DOMAIN}`,
    domain: ORG_DOMAIN,
    images: [
      {
        url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1761265485/o/blcgy/school/park.jpg",
        width: 590,
        height: 443,
        alt: "Bacchus Learning Centre Campus",
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
          title: "Bacchus Learning Centre",
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
