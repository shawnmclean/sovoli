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
		googleProfile: {
			label: "Google Business Synchronization",
			pitch:
				"We'll ensure your Google Business profile is up to date and accurate.",
			ctaLabel: "Get Google Business",
			covers: ["hasGoogleProfile"],
		},
		programs: {
			label: "Vocational/Academic Programs Setup",
			pitch:
				"Two free programs with curriculum, photos, videos, terms, dates, and more.",
			ctaLabel: "Get Programs",
			covers: ["hasAcademicPrograms"],
		},
		autoVerify: {
			label: "Sovoli Verification Badge",
			pitch:
				"We'll ensure your business is compliant with a trusted badge on our directory.",
			covers: [],
		},
		logo: {
			label: "Logo Design",
			pitch: "No logo? We'll create a custom one for your brand.",
			ctaLabel: "Design Logo",
			covers: ["hasLogo"],
			show: false,
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
					JMD: 40000, // ~250 USD * 155 JMD/USD (approximate rate)
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
					JMD: 5000, // ~25 USD * 155 JMD/USD (approximate rate)
				},
				optional: true,
				notes: "One-time logo design service.",
			},
			{
				id: "optional-campaign-ads",
				label: "Campaign Ads",
				description:
					"We run your Meta ads, generate copy, target audiences, and create images. Minimum 1 week, $50/week minimum spend.",
				billingCycle: "annual",
				amount: {
					GYD: 520000,
					USD: 2600,
					JMD: 403000, // ~2600 USD * 155 JMD/USD (approximate rate)
				},
				optional: true,
				notes:
					"Minimum 1 week campaign duration. $50/week minimum spend to get results and train the system.",
			},
			{
				id: "additional-programs",
				label: "Additional Programs",
				description:
					"Add additional programs, such as grade 1-6, waxing, massages, etc.",
				billingCycle: "one-time",
				amount: {
					GYD: 6000, // ~30 USD * 200 GYD/USD (approximate rate)
					USD: 30,
					JMD: 4000, // ~30 USD * 155 JMD/USD (approximate rate)
				},
				optional: true,
				isQuantityBased: true,
				notes:
					"One-time setup fee per additional program. Growth plan includes 2 programs.",
			},
		],

		discounts: [],
	},
};
