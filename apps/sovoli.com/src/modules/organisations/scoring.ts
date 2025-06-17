import type { ScoringDimensionConfig } from "./types";

export const digitalScoreConfig: ScoringDimensionConfig = {
  key: "digitalScore",
  label: "Digital Readiness",
  weight: 0.3,
  rules: [
    {
      key: "verified",
      label: "Verified Organization",
      maxScore: 10,
      compute: ({ org }) => (org.isVerified ? 10 : 0),
    },
    {
      key: "hasWebsite",
      label: "Has Website",
      maxScore: 5,
      compute: ({ org }) =>
        org.socialLinks?.some((l) => l.platform === "website") ? 5 : 0,
    },
    {
      key: "managedBySovoli",
      label: "Website Managed by Sovoli",
      maxScore: 5,
      compute: ({ websiteModule }) => (websiteModule ? 5 : 0),
    },
    {
      key: "hasEduDomain",
      label: "Has .edu.gy Domain (Private School)",
      maxScore: 10,
      compute: ({ org, websiteModule }) =>
        org.categories.includes("private-school") &&
        (org.socialLinks
          ?.find((l) => l.platform === "website")
          ?.url.endsWith(".edu.gy") ||
          websiteModule?.website.domain.endsWith(".edu.gy"))
          ? 10
          : 0,
      note: "Only applies to private schools",
    },
    {
      key: "hasEduEmail",
      label: "Has Educational Email Domain",
      maxScore: 5,
      compute: ({ org }) =>
        org.locations.some((loc) =>
          loc.contacts.some(
            (c) =>
              c.type === "email" &&
              (c.value.endsWith(".edu.gy") || c.value.endsWith(".edu")),
          ),
        )
          ? 5
          : 0,
    },
    {
      key: "hasFacebook",
      label: "Facebook Page Linked",
      maxScore: 5,
      compute: ({ org }) =>
        org.socialLinks?.some((l) => l.platform === "facebook") ? 5 : 0,
    },
    {
      key: "hasEmail",
      label: "Valid Email Address",
      maxScore: 5,
      compute: ({ org }) =>
        org.locations.some((loc) =>
          loc.contacts.some((c) => c.type === "email" && c.value.includes("@")),
        )
          ? 5
          : 0,
    },
    {
      key: "hasPhone",
      label: "Phone Number Present",
      maxScore: 5,
      compute: ({ org }) =>
        org.locations.some((loc) =>
          loc.contacts.some((c) => c.type === "phone"),
        )
          ? 5
          : 0,
    },
    {
      key: "hasWhatsapp",
      label: "WhatsApp Available",
      maxScore: 5,
      compute: ({ org }) =>
        org.locations.some((loc) =>
          loc.contacts.some((c) => c.type === "whatsapp"),
        )
          ? 5
          : 0,
    },
    {
      key: "hasPrograms",
      label: "Has Academic Programs",
      maxScore: 10,
      compute: ({ academicModule }) =>
        academicModule?.programs && academicModule.programs.length > 0 ? 10 : 0,
    },
  ],
};

export const academicScoreConfig: ScoringDimensionConfig = {
  key: "academicScore",
  label: "Academic Readiness",
  weight: 0.5,
  rules: [],
};
