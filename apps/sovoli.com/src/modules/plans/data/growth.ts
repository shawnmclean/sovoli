import type { PlanDefinition } from "../types";

export const growthPlan: PlanDefinition = {
  key: "growth",
  title: "Growth System",

  features: {
    website: {
      label: "Website Setup",
      pitch:
        "We'll setup your website with a custom domain and a few high converting pages.",
      ctaLabel: "Get Website",
      covers: ["hasWebsite", "hasWebsiteEduDomain"],
    },
    customDomain: {
      label: "Custom Domain",
      pitch: "We connect yourdomain.com and set up SSL so your site is secure.",
      covers: ["hasWebsiteEduDomain"],
    },
    googleProfile: {
      label: "Google Business Synchronization",
      pitch:
        "We'll ensure your Google Business profile is up to date and accurate.",
      ctaLabel: "Get Google Business",
      show: false,
      covers: ["hasGoogleProfile"],
    },
    programs: {
      label: "Vocational/Academic Programs Setup",
      pitch:
        "Two programs included with curriculum, photos, videos, terms, dates, and more.",
      ctaLabel: "Get Programs",
      covers: ["hasAcademicPrograms"],
    },
    autoVerify: {
      label: "Sovoli Verification Badge",
      pitch:
        "We'll ensure your business is compliant with a trusted badge on our directory.",
      covers: [],
    },
  },

  pricingPackage: {
    pricingItems: [
      {
        id: "base-plan-monthly",
        label: "Growth System",
        billingCycle: "monthly",
        amount: {
          USD: 30,
        },
        notes: "Monthly subscription to the Growth System.",
      },
      {
        id: "base-plan-annual",
        label: "Growth System",
        billingCycle: "annual",
        amount: {
          USD: 360,
        },
        notes: "Annual subscription to the Growth System.",
      },
      {
        id: "optional-campaign-ads",
        label: "Campaign Ads",
        description:
          "We run your Meta ads, generate copy, target audiences, and create images. Minimum 1 week, $50/week minimum spend.",
        billingCycle: "annual",
        amount: {
          USD: 2600,
        },
        optional: true,
        notes:
          "Minimum 1 week campaign duration. $50/week minimum spend to get results and train the system.",
      },
      {
        id: "additional-programs-monthly",
        label: "Additional Programs",
        description:
          "Add additional programs, such as grade 1-6, waxing, massages, etc.",
        billingCycle: "monthly",
        amount: {
          USD: 4,
        },
        optional: true,
        isQuantityBased: true,
        notes:
          "Monthly fee per additional program. Growth plan includes 2 programs.",
      },
      {
        id: "additional-programs-annual",
        label: "Additional Programs",
        description:
          "Add additional programs, such as grade 1-6, waxing, massages, etc.",
        billingCycle: "annual",
        amount: {
          USD: 36,
        },
        optional: true,
        isQuantityBased: true,
        notes:
          "Annual fee per additional program. Growth plan includes 2 programs.",
      },
    ],

    discounts: [
      {
        id: "yearly-15",
        label: "Yearly Savings",
        message: "Save 15% when you pay yearly",
        type: "percentage",
        value: 15,
        validUntil: "2099-12-31T23:59:59.999Z",
        appliesTo: ["base-plan-annual", "additional-programs-annual"],
      },
    ],
  },
};
