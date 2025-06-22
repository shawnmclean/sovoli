import type { OrgScoreRule } from "../types";

export const hasGoogleProfile: OrgScoreRule = {
  key: "hasGoogleProfile",
  label: "Google Profile Linked",
  maxScore: 5,
  compute: ({ org }) =>
    Promise.resolve({
      score: org.locations.some((loc) => loc.placeId) ? 5 : 0,
    }),
};
