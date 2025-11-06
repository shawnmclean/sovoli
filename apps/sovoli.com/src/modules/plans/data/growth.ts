import type { PlanDefinition } from "../types";

export const growthPlan: PlanDefinition = {
  key: "growth",
  title: "Growth System",
  onboardingNode: "Working with only 1 more school this month.",

  features: {
    autoVerify: {
      label: "Sovoli Verification Badge",
      pitch:
        "We'll ensure your school is compliant with a trusted badge on our trusted school directory.",
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
    logo: {
      label: "Logo Design",
      pitch: "No logo? We’ll create a custom one for your brand.",
      ctaLabel: "Design Logo",
      covers: ["hasLogo"],
    },
    campaignAds: {
      label: "Campaign Ads",
      pitch:
        "We'll run Facebook and Instagram ads for you, based on your budget.",
      ctaLabel: "Run Campaign Ads",
      covers: [],
    },
  },

  pricingPackage: {
    pricingItems: [
      {
        id: "setup",
        label: "Setup Fee",
        billingCycle: "one-time",
        amount: {
          GYD: 80000,
          USD: 400,
        },
        notes: "Covers website, email, domain, and business profile setup.",
      },
      {
        id: "annual-maintenance",
        label: "Annual Maintenance",
        billingCycle: "annual",
        amount: {
          GYD: 40000,
          USD: 200,
        },
        notes: "Includes domain renewal, email support, hosting, and updates.",
      },
    ],

    discounts: [
      {
        id: "early-growth-offer",
        type: "percentage",
        value: 25,
        message: "Special offer for the next school",
        validUntil: "2025-11-10",
        appliesTo: ["setup"],
      },
    ],
  },
};
