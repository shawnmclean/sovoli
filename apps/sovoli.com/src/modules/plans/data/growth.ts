import type { PlanDefinition } from "../types";

export const growthPlan: PlanDefinition = {
  key: "growth",
  title: "Growth Package",
  onboardingNode: "4/5 spots left this month.",

  features: {
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
        "If you don’t have registration documents, we’ll assist you with the process through the proper local channels.",
      ctaLabel: "Register School",
      covers: ["isVerified"],
    },
    logo: {
      label: "Logo Design",
      pitch: "No logo? We’ll create a custom one for your brand.",
      ctaLabel: "Design Logo",
      covers: ["hasLogo"],
    },
  },

  pricingItems: [
    {
      id: "setup",
      label: "Setup Fee",
      billingCycle: "one-time",
      amount: {
        GYD: 80000,
        USD: 400,
      },
      appliesTo: ["plan"],
      notes: "Covers website, email, domain, and business profile setup.",
    },
    {
      id: "annual-maintenance",
      label: "Annual Maintenance",
      billingCycle: "annually",
      amount: {
        GYD: 40000,
        USD: 200,
      },
      appliesTo: ["plan"],
      notes: "Includes domain renewal, email support, hosting, and updates.",
    },
    {
      id: "optional-registration-assist",
      label: "Registration Assistance",
      billingCycle: "one-time",
      amount: {
        GYD: 20000,
        USD: 100,
      },
      optional: true,
      appliesTo: ["addon"],
    },
    {
      id: "optional-logo",
      label: "Logo Design",
      billingCycle: "one-time",
      amount: {
        GYD: 5000,
        USD: 25,
      },
      optional: true,
      appliesTo: ["addon"],
    },
  ],

  discounts: [
    {
      id: "early-growth-offer",
      type: "percentage",
      value: 50,
      message: "Special offer for first 2 schools",
      validUntil: "2025-09-01",
      appliesTo: ["setup", "annual-maintenance"],
    },
  ],
};
