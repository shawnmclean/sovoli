import type { OrgInstance } from "~/modules/organisations/types";
import { parseOrgInstance } from "../../../utils/parseOrgInstance";
import { parseWebsiteModule } from "../../../utils/parseWebsiteModule";
import { parseMediaModule } from "../../../utils/parseMediaModule";

// Import JSON files
import orgData from "./org.json";
import websiteData from "./website.json";
import mediaData from "./media.json";
import workforceData from "./workforce.json";
import cyclesData from "./cycles.json";
import programGroupsData from "./program-groups.json";
import massageTherapyAcademicData from "./massage-therapy-academic.json";

/**
 * Healing Emerald Wellness Spa & Training Centre organization instance
 * All data loaded from JSON files and parsed using the parser utilities
 */
export const HEALING_EMERALD_ORG: OrgInstance = parseOrgInstance({
	jsonData: {
		org: orgData,
		media: mediaData,
		workforce: workforceData,
		cycles: cyclesData,
		programGroups: programGroupsData,
		groupAcademic: [massageTherapyAcademicData],
		website: websiteData,
	},
});

// Add programsPageHero and defaultSocialProof to website module
// These are not part of the website.json schema but are part of WebsiteModule
const parsedWebsiteModule = parseWebsiteModule(
	websiteData,
	orgData.username,
);

HEALING_EMERALD_ORG.websiteModule = {
	...parsedWebsiteModule,
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
};

// Add media array to org from media.json
// Only include gallery photos (exclude logo which is already in logoPhoto)
const mediaMap = parseMediaModule(mediaData);
const galleryMediaIds = ["hew-massage-model", "hew-reception-area"];
HEALING_EMERALD_ORG.org.media = galleryMediaIds
	.map((id) => mediaMap.get(id))
	.filter((media): media is NonNullable<typeof media> => media !== undefined);