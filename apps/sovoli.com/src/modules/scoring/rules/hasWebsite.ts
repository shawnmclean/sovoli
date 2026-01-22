import type { OrgScoreRule } from "../types";

export const hasWebsite: OrgScoreRule = {
  key: "hasWebsite",
  maxScore: 5,
  compute: ({ org }) =>
    Promise.resolve({
      score: org.socialLinks?.some((l) => l.platform === "website") ? 5 : 0,
    }),
};
