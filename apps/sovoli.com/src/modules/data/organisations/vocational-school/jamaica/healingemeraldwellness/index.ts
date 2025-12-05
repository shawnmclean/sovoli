import type { OrgInstance } from "~/modules/organisations/types";
import type { Website, WebsiteModule } from "~/modules/websites/types";
import { ORG_USERNAME, ORG_DOMAIN } from "./constants";
import { HEALING_EMERALD_ACADEMIC } from "./academic";
import { HEALING_EMERALD_WORKFORCE } from "./workforce";
import { HEALING_EMERALD_PHOTOS } from "./photos";

// Import JSON and set domain from constants
import websiteData from "./website.json";

const HEALING_EMERALD_WEBSITE: WebsiteModule = {
	website: {
		...(websiteData.website as Omit<Website, "domain" | "url">),
		domain: ORG_DOMAIN,
		url: `https://${ORG_DOMAIN}`,
	},
};

export const HEALING_EMERALD_ORG: OrgInstance = {
	org: {
		username: ORG_USERNAME,
		name: "Healing Emerald Wellness Spa & Training Centre Limited",
		logo: "/images/orgs/vocational-training/jamaica/healingemeraldwellness/logo.webp",
		isVerified: false,
		categories: ["vocational-school"],
		locations: [
			{
				key: "main-location",
				address: {
					line1: "4 Springvale Ave",
					city: "Kingston",
					countryCode: "JM",
				},
				contacts: [
					{
						type: "whatsapp",
						value: "+18763467995",
						isPublic: true,
					},
					{
						type: "phone",
						value: "+18763467995",
						isPublic: true,
					},
				],
				isPrimary: true,
			},
		],
		socialLinks: [
			{
				platform: "website",
				url: "https://www.healingemeraldwellness.com",
			},
		],
		media: HEALING_EMERALD_PHOTOS,
		internalCRM: {
			people: [
				{
					name: "Alisha Davis",
					contacts: [
						{
							type: "whatsapp",
							value: "+18763467995",
							isPublic: false,
						},
					],
					notes: "Owner of Healing Emerald Wellness Spa & Training Centre",
				},
			],
			claimStatus: "unclaimed",
		},
	},
	websiteModule: HEALING_EMERALD_WEBSITE,
	academicModule: HEALING_EMERALD_ACADEMIC,
	serviceModule: null,
	workforceModule: HEALING_EMERALD_WORKFORCE,
	scoringModule: null,
};
