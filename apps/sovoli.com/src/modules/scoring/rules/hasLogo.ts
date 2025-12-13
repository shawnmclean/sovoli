import type { OrgScoreRule } from "../types";

export const hasLogo: OrgScoreRule = {
  key: "hasLogo",
  maxScore: 5,
  compute: ({ org }) =>
    Promise.resolve({
      score: org.logoPhoto ? 5 : 0,
    }),
};
