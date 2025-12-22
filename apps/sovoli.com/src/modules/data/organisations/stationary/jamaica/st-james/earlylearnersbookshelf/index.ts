import type { OrgInstance } from "~/modules/organisations/types";
import { parseOrgInstance } from "../../../../utils/parseOrgInstance";
import { parseMediaModule } from "../../../../utils/parseMediaModule";

// Import JSON files
import orgData from "./org.json";
import websiteData from "./website.json";
import mediaData from "./media.json";
import workforceData from "./workforce.json";
import catalogData from "./catalog.json";

/**
 * Early Learners Bookshelf organization instance
 * All data loaded from JSON files and parsed using the parser utilities
 */
export const EARLY_LEARNERS_BOOKSHELF_ORG: OrgInstance = parseOrgInstance({
	jsonData: {
		org: orgData,
		website: websiteData,
		media: mediaData,
		workforce: workforceData,
		catalog: catalogData,
	},
});

// Add media array to org from media.json
// Only include gallery photos (exclude logo which is already in logoPhotoId)
const mediaMap = parseMediaModule(mediaData);
const galleryMediaIds: string[] = []; // Will be populated when gallery photos are added
EARLY_LEARNERS_BOOKSHELF_ORG.org.media = galleryMediaIds
	.map((id) => mediaMap.get(id))
	.filter((media): media is NonNullable<typeof media> => media !== undefined);

