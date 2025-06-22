import type { OrgScoreRule } from "../types";

export const hasFacebook: OrgScoreRule = {
  key: "hasFacebook",
  label: "Facebook Page Linked",
  maxScore: 5,
  compute: ({ org }) =>
    Promise.resolve({
      score: org.socialLinks?.some((l) => l.platform === "facebook") ? 5 : 0,
    }),
};
