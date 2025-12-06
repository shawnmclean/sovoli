import type { OrgInstance } from "~/modules/organisations/types";
import type { Website, WebsiteModule } from "~/modules/websites/types";
import { parseOrgInstance } from "../../../utils/parseOrgInstance";
import { ORG_DOMAIN } from "./constants";
import { HEALING_EMERALD_ACADEMIC } from "./academic";
import { HEALING_EMERALD_WORKFORCE } from "./workforce";
import { HEALING_EMERALD_PHOTOS } from "./photos";

// Import JSON files
import orgData from "./org.json";
import websiteData from "./website.json";

// Build website module with domain from constants (env-aware)
const HEALING_EMERALD_WEBSITE: WebsiteModule = {
	programsPageHero: {
		headline: "Transform Lives Through the Power of Touch",
		subtext:
			"Find the perfect program to launch your career in wellness therapy.",
		socialProof: {
			count: "100+",
			audienceLabel: "graduates",
			locationContext: "in Kingston, Jamaica",
		},
	},
	defaultSocialProof: {
		count: "100+",
		audienceLabel: "clients",
	},
	website: {
		...(websiteData.website as Omit<Website, "domain" | "url">),
		domain: ORG_DOMAIN,
		url: `https://${ORG_DOMAIN}`,
	},
};

/**
 * Healing Emerald Wellness Spa & Training Centre organization instance
 * Org data loaded from JSON, website domain from constants for env swap
 */
export const HEALING_EMERALD_ORG: OrgInstance = parseOrgInstance({
	jsonData: {
		org: orgData,
	},
	existingInstance: {
		websiteModule: HEALING_EMERALD_WEBSITE,
		academicModule: HEALING_EMERALD_ACADEMIC,
		workforceModule: HEALING_EMERALD_WORKFORCE,
	},
});

// Add media to org after parsing
HEALING_EMERALD_ORG.org.media = HEALING_EMERALD_PHOTOS;
