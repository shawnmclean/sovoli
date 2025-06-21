import type { OrgScoreRule } from "../../types";

export const sharedRules: Record<string, OrgScoreRule> = {
  verified: {
    key: "verified",
    label: "Verified Organization",
    maxScore: 10,
    compute: ({ org }) =>
      Promise.resolve({
        score: org.isVerified ? 10 : 0,
        note: org.isVerified
          ? "Organization is verified"
          : "Business registration document is required.",
      }),
  },

  hasWebsite: {
    key: "hasWebsite",
    label: "Has Website",
    maxScore: 5,
    compute: ({ org }) =>
      Promise.resolve({
        score: org.socialLinks?.some((l) => l.platform === "website") ? 5 : 0,
      }),
  },
  hasFacebook: {
    key: "hasFacebook",
    label: "Facebook Page Linked",
    maxScore: 5,
    compute: ({ org }) =>
      Promise.resolve({
        score: org.socialLinks?.some((l) => l.platform === "facebook") ? 5 : 0,
      }),
  },
  hasEmail: {
    key: "hasEmail",
    label: "Valid Email Address",
    maxScore: 5,
    compute: ({ org }) =>
      Promise.resolve({
        score: org.locations.some((loc) =>
          loc.contacts.some((c) => c.type === "email" && c.value.includes("@")),
        )
          ? 5
          : 0,
      }),
  },
  hasPhone: {
    key: "hasPhone",
    label: "Phone Number Present",
    maxScore: 5,
    compute: ({ org }) =>
      Promise.resolve({
        score: org.locations.some((loc) =>
          loc.contacts.some((c) => c.type === "phone"),
        )
          ? 5
          : 0,
      }),
  },
  hasWhatsapp: {
    key: "hasWhatsapp",
    label: "WhatsApp Available",
    maxScore: 5,
    compute: ({ org }) =>
      Promise.resolve({
        score: org.locations.some((loc) =>
          loc.contacts.some((c) => c.type === "whatsapp"),
        )
          ? 5
          : 0,
      }),
  },
  hasGoogleProfile: {
    key: "hasGoogleProfile",
    label: "Google Profile Linked",
    maxScore: 5,
    compute: ({ org }) =>
      Promise.resolve({
        score: org.locations.some((loc) => loc.placeId) ? 5 : 0,
      }),
  },
};
