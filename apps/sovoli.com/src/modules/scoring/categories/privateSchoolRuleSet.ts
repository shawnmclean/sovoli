import type { CategoryRuleSet } from "../types";

export const privateSchoolRuleSet: CategoryRuleSet = {
  category: "private-school",
  groups: [
    {
      key: "trust",
      label: "🛡️ Trust & Safety",
      adminDescription:
        "Improving trust signals — such as verification and online presence — helps parents feel confident before contacting your school.",
      consumerDescription:
        "These checks help you know if the school is officially recognized and easy to find or verify online.",
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
      label: "📚 Learning & Curriculum",
      adminDescription:
        "Listing your academic programs clearly demonstrates your school's educational offerings.",
      consumerDescription:
        "This shows if the school offers well-defined academic programs for your child’s development.",
      weight: 1,
      rules: ["hasAcademicPrograms"],
    },

    {
      key: "communication",
      label: "📞 Communication",
      adminDescription:
        "Providing valid phone, email, and WhatsApp contact options helps parents reach out easily and builds credibility.",
      consumerDescription:
        "These are ways you can directly reach the school to ask questions or schedule a visit.",
      weight: 1,
      rules: ["hasPhone", "hasEmail", "hasWhatsapp"],
    },
  ],
};
