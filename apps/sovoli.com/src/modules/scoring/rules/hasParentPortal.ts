import type { OrgScoreRule } from "../types";

export const hasParentPortal: OrgScoreRule = {
  key: "hasParentPortal",
  maxScore: 10,
  compute: ({ org }) => {
    const techStack = org.techStack;
    const parentPortal = techStack?.parentPortal;
    const parentPortalPlatform = Array.isArray(parentPortal)
      ? parentPortal[0]
      : parentPortal;

    switch (parentPortalPlatform?.type) {
      case "manual":
        return Promise.resolve({
          score: 0,
          note: "No parent portal is in use. Communication and updates are managed manually.",
        });
      case "integrated":
        return Promise.resolve({
          score: 10,
          note: "This school uses a fully integrated parent portal. Parents can access grades, attendance, and updates directly online.",
        });
      case "external":
        return Promise.resolve({
          score: 5,
          note: "This school uses an external parent portal on a separate platform. You may need to use another app or website to access updates and grades.",
        });
      default:
        return Promise.resolve({
          score: 0,
          note: "Parent portal information is missing or incomplete.",
        });
    }
  },
};
