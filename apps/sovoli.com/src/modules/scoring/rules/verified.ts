import type { OrgScoreRule } from "../types";

export const verified: OrgScoreRule = {
  key: "verified",
  maxScore: 10,
  compute: ({ org }) =>
    Promise.resolve({
      score: org.isVerified ? 10 : 0,
      note: org.isVerified
        ? "Organization is verified"
        : "Business registration document is required.",
    }),
};
