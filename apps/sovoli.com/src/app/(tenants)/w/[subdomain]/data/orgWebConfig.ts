export interface PageSection {
  type: string;
  title?: string;
  subtitle?: string;
  layout?: string;
  contentRefs: string[];
}

export interface PageConfig {
  title?: string;
  subtitle?: string;
  heroImage?: string;
  sections: PageSection[];
}

export interface OrgWebConfig {
  home: PageConfig;
  about: PageConfig;
  [key: string]: PageConfig | undefined;
}

export const orgWebConfig: OrgWebConfig = {
  home: {
    title: "Welcome to Modern Academy",
    subtitle: "Empowering Minds, Shaping Futures",
    heroImage: "/images/hero.jpg",

    sections: [
      {
        type: "missionVisionValues",
        title: "The First Principles",
        subtitle:
          "Guiding principles that shape our approach to education and community building",
        layout: "cards",
        contentRefs: ["mission", "vision", "values"],
      },
    ],
  },

  about: {
    title: "About Us",
    subtitle:
      "Learn more about our vision, mission, and the values that guide us",
    heroImage: "/images/about.jpg",

    sections: [
      {
        type: "missionVision",
        title: "Mission & Vision",
        layout: "columns",
        contentRefs: ["mission", "vision"],
      },
      {
        type: "coreValues",
        title: "Our Core Values",
        subtitle: "The principles that guide everything we do",
        layout: "grid",
        contentRefs: ["values"],
      },
    ],
  },
};
