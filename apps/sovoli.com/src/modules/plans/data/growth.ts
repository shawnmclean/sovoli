import type { PlanDefinition } from "../types";

export const growthPlan: PlanDefinition = {
  key: "growth",
  title: "Growth Package",

  pricing: {
    oneTime: {
      GYD: 80000,
      USD: 400,
    },
    yearly: {
      GYD: 40000,
      USD: 200,
    },
    note: "Yearly covers domain renewal, email support, website maintenance, and hosting.",
  },
  discount: {
    percentage: 50,
    message: "Special offer for first 2 schools",
  },
  onboardingNode: "4/5 spots left this month.",

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
      label: "Need Help Getting Verified?",
      pitch:
        "If you don’t have registration documents, we’ll assist you with the process through the proper local channels so you can still get verified.",
      ctaLabel: "Register School",
      covers: ["isVerified"],
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
