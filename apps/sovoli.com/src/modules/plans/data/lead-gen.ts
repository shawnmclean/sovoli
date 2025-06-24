import type { PlanDefinition } from "../types";

export const leadGenPlan: PlanDefinition = {
  key: "lead-gen",
  title: "Lead Generation Package",
  subtitle: "Attract more parents with a strong online profile.",
  description:
    "We help you get verified, set up your Google profile, and make your school easy to discover online.",

  pricing: {
    oneTime: {
      GYD: 75000,
      USD: 375,
    },
    yearly: {
      GYD: 40000,
      USD: 200,
    },
    note: "Yearly covers domain renewal, email support, website maintenance, and hosting.",
  },
  discount: {
    oneTime: {
      GYD: 40000,
      USD: 200,
    },
    message: "Special offer for first 2 schools",
  },
  onboardingNode: "Only 5 schools will be onboarded per month.",

  offers: {
    autoVerify: {
      label: "Verification Badge",
      covers: [],
    },
    googleProfile: {
      label: "Google Business Setup",
      pitch: "We'll set up or review your Google Business profile.",
      ctaLabel: "Get Google Business",
      covers: ["hasGoogleProfile"],
    },
    website: {
      label: "Website Setup",
      pitch: "We'll set up your website with an .edu.gy domain.",
      ctaLabel: "Get Website",
      covers: ["hasWebsite", "hasWebsiteEduDomain"],
    },
    email: {
      label: "Email Setup",
      pitch:
        "We'll set up your email with an @edu.gy domain for up to 3 admins.",
      ctaLabel: "Get Email",
      covers: ["hasEmail", "hasEmailEduDomain"],
    },
    registration: {
      label: "Sovoli Verified",
      pitch:
        "No registration documents? We'll assist you in registering your school through the appropriate local channels.",
      ctaLabel: "Register School",
      covers: ["verified"],
      optional: {
        pricing: {
          GYD: 20000,
          USD: 100,
        },
      },
    },
    logo: {
      label: "Logo Design",
      pitch: "No logo? We’ll create a custom one for your brand.",
      ctaLabel: "Design Logo",
      covers: ["hasLogo"],
      optional: {
        pricing: {
          GYD: 5000,
          USD: 25,
        },
      },
    },
  },
};
