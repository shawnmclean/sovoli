import type { OrgUxGroup } from "../../types";
import type { PrivateSchoolRuleKey } from "./rules";

export const privateSchoolUxGroups: OrgUxGroup<PrivateSchoolRuleKey>[] = [
  {
    key: "trust",
    label: "Trust & Safety",
    icon: "🛡️",
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
    rules: ["hasAcademicPrograms"],
  },
  {
    key: "communication",
    label: "Communication",
    icon: "📞",
    rules: ["hasPhone", "hasEmail", "hasWhatsapp"],
  },
];
