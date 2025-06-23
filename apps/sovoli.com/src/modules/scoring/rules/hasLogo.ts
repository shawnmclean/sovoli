import type { OrgScoreRule } from "../types";

export const hasLogo: OrgScoreRule = {
  key: "hasLogo",
  maxScore: 5,
  compute: ({ org }) =>
    Promise.resolve({
      score: org.logo ? 5 : 0,
    }),
};
