import type { OrgScoreRule } from "../types";

export const hasWhatsapp: OrgScoreRule = {
  key: "hasWhatsapp",
  maxScore: 5,
  compute: ({ org }) =>
    Promise.resolve({
      score: org.locations.some((loc) =>
        loc.contacts.some((c) => c.type === "whatsapp"),
      )
        ? 5
        : 0,
    }),
};
