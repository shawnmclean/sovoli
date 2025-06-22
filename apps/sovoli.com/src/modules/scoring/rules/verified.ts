import type { OrgScoreRule } from "../types";

export const verified: OrgScoreRule = {
  key: "verified",
  label: "Verified Organization",
  consumerDescription:
    "A verified school has submitted official documentation and meets Sovoli’s minimum recognition standards.",

  adminDescription:
    "Submit your business registration document to earn Verified status and build trust with parents.",

  maxScore: 10,
  compute: ({ org }) =>
    Promise.resolve({
      score: org.isVerified ? 10 : 0,
      note: org.isVerified
        ? "Organization is verified"
        : "Business registration document is required.",
    }),
};
