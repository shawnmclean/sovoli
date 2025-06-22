import type { CategoryRuleSet } from "../types";

export const privateSchoolRuleSet: CategoryRuleSet = {
  category: "private-school",
  groups: [
    {
      key: "trust",
      label: "Trust & Safety",
      icon: "🛡️",
      weight: 1,
      rules: [
        "verified",
        "hasGoogleProfile",
        "hasWebsiteEduDomain",
        "hasEmailEduDomain",
      ],
    },
    {
      key: "curriculum",
      label: "Learning & Curriculum",
      icon: "📚",
      weight: 1,
      rules: ["hasAcademicPrograms"],
    },

    {
      key: "communication",
      label: "Communication",
      icon: "📞",
      weight: 1,
      rules: ["hasPhone", "hasEmail", "hasWhatsapp"],
    },
  ],
};
