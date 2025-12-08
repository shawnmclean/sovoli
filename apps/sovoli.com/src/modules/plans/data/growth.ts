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
		logo: {
			label: "Logo Design",
			pitch: "No logo? We'll create a custom one for your brand.",
			ctaLabel: "Design Logo",
			covers: ["hasLogo"],
		},
		campaignAds: {
			label: "Campaign Ads",
			pitch: "We help drive traffic from Meta ads. Minimum $50 per week.",
			ctaLabel: "Run Campaign Ads",
			covers: [],
		},
	},

	pricingPackage: {
		pricingItems: [
			{
				id: "base-plan",
				label: "Growth System",
				billingCycle: "annual",
				amount: {
					GYD: 50000,
					USD: 250,
					JMD: 38750, // ~250 USD * 155 JMD/USD (approximate rate)
				},
				notes: "Annual subscription to the Growth System.",
			},
			{
				id: "optional-logo",
				label: "Logo Design",
				description: "Custom logo design for your brand",
				billingCycle: "one-time",
				amount: {
					GYD: 5000,
					USD: 25,
					JMD: 3875, // ~25 USD * 155 JMD/USD (approximate rate)
				},
				optional: true,
				notes: "One-time logo design service.",
			},
			{
				id: "optional-campaign-ads",
				label: "Campaign Ads",
				description: "Meta ads management - minimum $50 per week",
				billingCycle: "annual",
				amount: {
					GYD: 520000,
					USD: 2600,
					JMD: 403000, // ~2600 USD * 155 JMD/USD (approximate rate)
				},
				optional: true,
				notes: "Minimum $50 per week for Meta ads management.",
			},
		],

		discounts: [],
	},
};
