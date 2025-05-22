export interface ContentValue {
  name: string;
  icon?: string;
  body?: string;
}

export interface OrgContent {
  mission: ContentValue;
  vision: ContentValue;
  values: ContentValue[];
}

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
