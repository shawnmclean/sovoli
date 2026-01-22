import type { OrgScoreRule } from "../types";

export const hasPhone: OrgScoreRule = {
  key: "hasPhone",
  maxScore: 5,
  compute: ({ org }) =>
    Promise.resolve({
      score: org.locations.some((loc) =>
        loc.contacts.some((c) => c.type === "phone" || c.type === "whatsapp"),
      )
        ? 5
        : 0,
    }),
};
