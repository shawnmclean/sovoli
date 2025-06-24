import type { PlanDefinition } from "./types";

export const plans: PlanDefinition[] = [
  {
    key: "lead-gen",
    title: "Lead Generation Package",
    subtitle: "Attract more parents with a strong online profile.",
    description:
      "We help you get verified, set up your Google profile, and make your school easy to discover online.",

    includedRules: [
      "verified",
      "hasLogo",
      "hasGoogleProfile",
      "hasWebsite",
      "hasWebsiteEduDomain",
      "hasEmail",
      "hasEmailEduDomain",
    ],
    includedFeatures: [
      "Google verification",
      "Google profile",
      "website",
      "email",
    ],
  },
  {
    key: "enrollment",
    title: "Enrollment Package",
    subtitle: "Smooth out your application process and increase conversions.",
    description:
      "We create an enrollment form, connect it to WhatsApp or email, and help parents complete applications easily.",

    includedRules: ["enrollmentMethod", "hasFees", "hasWhatsapp"],
    includedFeatures: [
      "enrollment form",
      "WhatsApp integration",
      "email integration",
    ],
  },
  {
    key: "sis",
    title: "Student Management (SIS)",
    subtitle: "Upgrade to a full student information system.",
    description:
      "We help you digitize attendance, grades, student records, and parent communication with a secure portal.",

    includedRules: ["hasParentPortal"],
    includedFeatures: [
      "parent portal",
      "student records",
      "attendance tracking",
    ],
  },
];
