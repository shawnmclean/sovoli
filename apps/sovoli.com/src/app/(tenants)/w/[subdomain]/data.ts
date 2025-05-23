import type {
  OrgContent,
  OrgMeta,
  OrgWebConfig,
} from "~/modules/website/types";

export const orgMeta: OrgMeta = {
  name: "Modern Academy",
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
};

export const orgContent: OrgContent = {
  mission: {
    name: "Mission",
    icon: "target",
    body: "To provide a nurturing and inclusive environment where every student is empowered to excel academically, grow personally, and develop into compassionate global citizens.",
  },

  vision: {
    name: "Vision",
    icon: "eye",
    body: "We envision a world where education is a transformative journey that cultivates lifelong learners, fosters critical thinking, and empowers individuals to make a positive impact on their communities and the world.",
  },

  values: [
    {
      name: "Integrity and Respect",
      icon: "shield",
      body: "We uphold the highest ethical standards in all our actions and decisions.",
    },
    {
      name: "Academic Excellence",
      icon: "award",
      body: "We strive to achieve the highest levels of academic performance and intellectual growth.",
    },
    {
      name: "Creativity and Innovation",
      icon: "lightbulb",
      body: "We encourage imaginative thinking and embrace new ideas.",
    },
    {
      name: "Community Engagement",
      icon: "users",
      body: "We foster a strong sense of connection and service within our local and global communities.",
    },
    {
      name: "Lifelong Learning",
      icon: "book",
      body: "We nurture a mindset of growth and continuous curiosity.",
    },
  ],
};

export const orgWebConfig: OrgWebConfig = {
  home: {
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
          { label: "Apply Now", href: "/programs/apply" },
          { label: "Schedule a Visit", href: "/schedule" },
        ],
      },
      {
        type: "metrics",
      },
      {
        type: "cards",
        title: "The First Principles",
        subtitle:
          "Guiding principles that shape our approach to education and community building",
      },
    ],
  },
  about: {
    title: "About Us",
    subtitle:
      "Learn more about our vision, mission, and the values that guide us",

    sections: [
      {
        type: "hero",
        layout: "condensed",
        variant: "image",
        title: "About Us",
        subtitle:
          "Join a community dedicated to academic excellence and personal growth",
        backgroundImage:
          "https://img.heroui.chat/image/places?w=1920&h=600&u=2",
      },
    ],
  },
};
