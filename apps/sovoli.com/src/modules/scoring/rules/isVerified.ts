import type { OrgScoreRule } from "../types";

export const isVerified: OrgScoreRule = {
  key: "isVerified",
  maxScore: 10,
  compute: ({ org }) => {
    if (!org.verification) {
      return Promise.resolve({
        score: 0,
        description:
          "This organization is unverified (verification not started).",
      });
    }

    switch (org.verification.status) {
      case "verified":
        return Promise.resolve({
          score: 10,
          description: "This organization is verified.",
        });
      case "pending":
        return Promise.resolve({
          score: 0,
          description: "This organization is pending verification.",
        });
      default:
        return Promise.resolve({
          score: 0,
          description: "This organization is not verified.",
        });
    }
  },
};
