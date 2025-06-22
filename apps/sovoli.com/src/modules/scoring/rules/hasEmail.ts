import type { OrgScoreRule } from "../types";

export const hasEmail: OrgScoreRule = {
  key: "hasEmail",
  maxScore: 5,
  compute: ({ org }) =>
    Promise.resolve({
      score: org.locations.some((loc) =>
        loc.contacts.some((c) => c.type === "email" && c.value.includes("@")),
      )
        ? 5
        : 0,
    }),
};
