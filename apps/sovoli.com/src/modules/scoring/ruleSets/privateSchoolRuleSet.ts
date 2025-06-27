import type { RuleSet } from "../types";

export const privateSchoolRuleSet: RuleSet = {
  groups: [
    {
      key: "safety",
      label: "Safety & Legitimacy",
      weight: 1,
      rules: [
        "isClaimed",
        "isVerified",
        "hasLogo",
        "hasWebsiteEduDomain",
        "hasEmailEduDomain",
        "hasGoogleProfile",
      ],
      description:
        "Signals that your school is recognized, official, and publicly trusted.",
    },
    {
      key: "communication",
      label: "Communication & Support",
      weight: 1,
      rules: ["hasPhone", "hasEmail", "hasWhatsapp"],
      description:
        "Helps parents reach your school, ask questions, and stay informed.",
    },
    {
      key: "digital",
      label: "Online Presence & Tools",
      weight: 1,
      rules: ["hasWebsite", "hasParentPortal"],
      description:
        "Shows how prepared your school is to operate online and provide digital access for families.",
    },
    {
      key: "transparency",
      label: "Fees & Academic Info",
      weight: 1,
      rules: ["hasFees", "hasTeachers", "hasAcademicPrograms"],
      description:
        "Gives parents the details they need to compare schools and make informed decisions.",
    },
    {
      key: "enrollment",
      label: "Enrollment Experience",
      weight: 1,
      rules: ["enrollmentMethod"],
      description:
        "Clear enrollment steps make it easier for parents to join your school.",
    },
  ],

  ruleMetadata: {
    isClaimed: {
      key: "isClaimed",
      label: "Claimed Profile",
      description:
        "This school has confirmed its information and manages its page directly.",
      reasons: [
        "Take control of your school’s page on Sovoli.",
        "Update contact info, fees, staff, and programs.",
        "Show parents and partners you're active.",
      ],

      actions: ["Submit a claim request with verification."],

      requirements: [
        "Your full name and job title",
        "School name and contact info",
        {
          label: "Proof of affiliation",
          description: "Submit one of the following:",
          items: [
            "A message from school's phone or WhatsApp",
            "A photo of school ID or badge",
            "A letter on school letterhead",
            "An email from a school domain (e.g. @school.edu.gy)",
          ],
        },
      ],
      effort: "low",
      includedInPlan: [],
    },
    isVerified: {
      key: "isVerified",
      label: "Verified Organization",
      description:
        "This school is officially registered with a government or recognized body.",
      reasons: [
        "Builds trust with parents and partners.",
        "Qualifies your school for listings and programs.",
      ],
      actions: ["Upload a valid registration document."],
      requirements: [
        {
          label: "Proof of registration",
          description: "Submit one of the following:",
          items: [
            "Ministry of Education certificate",
            "Business registration document",
            "Letter from an official authority",
          ],
        },
      ],

      effort: "medium",
      includedInPlan: ["lead-gen"],
    },
    hasLogo: {
      key: "hasLogo",
      label: "School Logo",
      description:
        "The school has a visible logo for branding and recognition.",
      reasons: [
        "Easier for parents to recognize your school.",
        "Boosts credibility with consistent branding.",
      ],
      actions: ["Upload a clean, recognizable logo."],
      requirements: [
        {
          label: "Logo file",
          description: "Use a clean image with minimum size:",
          items: ["JPEG or PNG format", "At least 300×300 pixels"],
        },
      ],
      effort: "low",
      includedInPlan: ["lead-gen"],
    },
    hasWebsiteEduDomain: {
      key: "hasWebsiteEduDomain",
      label: "Education Domain (.edu.gy)",
      description:
        "School uses a government-approved domain (e.g. .edu.gy) for recognition and credibility.",
      reasons: [
        "Signals official status",
        "Improves search ranking",
        "Banks and other institutions will trust your school",
      ],
      actions: [
        "Link your existing .edu.gy website",
        "Or request a Sovoli-built site",
      ],
      requirements: ["Website URL ending in .edu.gy"],
      effort: "high",
      includedInPlan: ["lead-gen"],
    },
    hasEmailEduDomain: {
      key: "hasEmailEduDomain",
      label: "Education Email Address",
      description:
        "School has a working email tied to its education domain (e.g. .edu.gy).",
      reasons: [
        "Looks professional to parents",
        "Reduces chance of emails being marked as spam",
        "Banks and other institutions will trust your school",
      ],
      actions: ["Use an email ending in .edu.gy"],
      requirements: ["Email like info@school.edu.gy"],
      effort: "medium",
      includedInPlan: ["lead-gen"],
    },
    hasGoogleProfile: {
      key: "hasGoogleProfile",
      label: "Google Maps Listing",
      description: "School appears on Google Maps with accurate info.",
      reasons: ["Improves visibility", "Builds trust with parents"],
      actions: ["Claim or create a Google Business Profile"],
      requirements: ["Live Google listing URL"],
      effort: "medium",
      includedInPlan: ["lead-gen"],
    },
    hasPhone: {
      key: "hasPhone",
      label: "Phone Number",
      description: "Parents can call the school directly.",
      reasons: ["Builds trust", "Supports urgent communication"],
      actions: ["Add a working phone number"],
      requirements: ["Local, reachable number"],
      effort: "low",
      includedInPlan: [],
    },
    hasEmail: {
      key: "hasEmail",
      label: "Email Contact",
      description: "Allows formal communication and record keeping.",
      reasons: ["Supports official queries", "Enables written follow-up"],
      actions: ["Add an active school email"],
      requirements: ["Working email address"],
      effort: "low",
      includedInPlan: ["lead-gen"],
    },
    hasWhatsapp: {
      key: "hasWhatsapp",
      label: "WhatsApp Contact",
      description: "Enables fast, familiar messaging for parents.",
      reasons: ["Widely used by parents", "Quick issue resolution"],
      actions: ["Add an active WhatsApp number"],
      requirements: ["Phone number linked to WhatsApp"],
      effort: "low",
      includedInPlan: [],
    },
    hasWebsite: {
      key: "hasWebsite",
      label: "School Website",
      description: "The school has a working website.",
      reasons: [
        "Improves search visibility",
        "Provides a central place for parents to learn more",
      ],
      actions: ["Link your existing website", "Or request a Sovoli-built site"],
      requirements: ["Working website URL"],
      effort: "medium",
      includedInPlan: ["lead-gen"],
    },
    hasParentPortal: {
      key: "hasParentPortal",
      label: "Parent Portal",
      description:
        "A digital portal where parents can check updates, grades, and messages.",
      reasons: [
        "Keeps parents informed without constant calls",
        "Builds trust through transparency",
        "Shows digital maturity to outsiders",
      ],
      actions: ["Link to your parent portal"],
      requirements: ["Parent access link (e.g., PortalPlus)"],
      effort: "medium",
      includedInPlan: [],
    },
    hasFees: {
      key: "hasFees",
      label: "Fees Listed",
      description: "Parents can see the school's tuition or fee structure.",
      reasons: ["Helps parents plan ahead", "Reduces calls asking about cost"],
      actions: ["Enter your latest fee structure"],
      requirements: ["Amount for each program (monthly, term, annual)"],
      effort: "low",
      priority: "high",
      priorityReason: "Parents usually ask about this first.",
      includedInPlan: [],
    },
    hasTeachers: {
      key: "hasTeachers",
      label: "Teachers Listed",
      description: "Names and positions of teaching staff",
      reasons: ["Builds trust", "Lets parents know who's teaching"],
      actions: ["Enter staff names and titles"],
      requirements: ["A list of teachers and their roles"],
      effort: "low",
      includedInPlan: [],
    },
    hasAcademicPrograms: {
      key: "hasAcademicPrograms",
      label: "Academic Programs",
      description: "Lists of classes or grade levels offered.",
      reasons: [
        "Helps parents understand what’s taught",
        "Supports comparisons across schools",
      ],
      actions: ["Upload a list of programs offered"],
      requirements: [
        "A list of programs offered (e.g., Nursery, Primary, Secondary)",
      ],
      effort: "medium",
      includedInPlan: [],
    },
    enrollmentMethod: {
      key: "enrollmentMethod",
      label: "Enrollment Method",
      description: "Clear steps for parents to apply.",
      reasons: ["Less confusion for parents", "More successful applications"],
      actions: ["Share your process"],
      requirements: [
        "Method of application (e.g., WhatsApp, form, manual)",
        {
          label: "Enrollment process",
          description: "Submit any of the following:",
          items: [
            "A link to an application form",
            "A WhatsApp message flow",
            "A brief explanation of manual steps",
          ],
        },
      ],
      effort: "medium",
      includedInPlan: [],
    },
  },
};
