import type { OrgScoreRule } from "../types";

export const enrollmentMethod: OrgScoreRule = {
  key: "enrollmentMethod",
  maxScore: 10,
  compute: ({ org }) => {
    const techStack = org.techStack;
    const enrollment = techStack?.enrollment;

    switch (enrollment?.method) {
      case "manual":
        return Promise.resolve({
          score: 0,
          note: "Enrollment is handled in-person or verbally. No online application is available.",
        });

      case "whatsapp":
        return Promise.resolve({
          score: 2,
          note: "Enrollment is handled through WhatsApp. Parents must message the school to apply.",
        });

      case "external-form":
        return Promise.resolve({
          score: 5,
          note: "Enrollment is handled using an external form (e.g., Google Form). Submission is possible online, but not fully connected to the school system.",
        });

      case "integrated":
        return Promise.resolve({
          score: 10,
          note: "Enrollment is handled through an integrated system. Parents can apply online and receive confirmation automatically.",
        });

      default:
        return Promise.resolve({
          score: 0,
          note: "Enrollment method is not defined or incomplete.",
        });
    }
  },
};
