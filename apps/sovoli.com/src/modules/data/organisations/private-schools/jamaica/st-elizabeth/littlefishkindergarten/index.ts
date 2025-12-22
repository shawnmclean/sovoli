import type { OrgInstance } from "~/modules/organisations/types";
import { parseOrgInstance } from "../../../../utils/parseOrgInstance";

// Import JSON files
import orgData from "./org.json";
import websiteData from "./website.json";
import cyclesData from "./cycles.json";
import programGroupsData from "./program-groups.json";
import nurseryAcademicData from "./nursery-academic.json";
import workforceData from "./workforce.json";

/**
 * Little Fish Kindergarten organization instance
 * All data loaded from JSON files and parsed using the parser utilities
 */
export const LITTLE_FISH_KINDERGARTEN_ORG: OrgInstance = parseOrgInstance({
	jsonData: {
		org: orgData,
		website: websiteData,
		cycles: cyclesData,
		programGroups: programGroupsData,
		groupAcademic: [nurseryAcademicData],
		workforce: workforceData,
	},
});
