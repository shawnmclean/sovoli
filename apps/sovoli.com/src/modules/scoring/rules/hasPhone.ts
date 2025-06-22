import type { OrgScoreRule } from "../types";

export const hasPhone: OrgScoreRule = {
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
};
