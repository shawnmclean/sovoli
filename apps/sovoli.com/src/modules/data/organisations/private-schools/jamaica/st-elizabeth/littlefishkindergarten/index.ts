import { EARLY_LEARNERS_BOOKSHELF_ORG } from "~/modules/data/organisations/stationary/jamaica/st-james/earlylearnersbookshelf";
import type { OrgInstance } from "~/modules/organisations/types";
import { parseMediaModule } from "../../../../utils/parseMediaModule";
import { parseOrgInstance } from "../../../../utils/parseOrgInstance";
import cyclesData from "./cycles.json";
import mediaData from "./media.json";
import nurseryAcademicData from "./nursery-academic.json";
// Import JSON files
import orgData from "./org.json";
import programGroupsData from "./program-groups.json";
import websiteData from "./website.json";
import workforceData from "./workforce.json";

/**
 * Little Fish Kindergarten organization instance
 * All data loaded from JSON files and parsed using the parser utilities
 */
export const LITTLE_FISH_KINDERGARTEN_ORG: OrgInstance = parseOrgInstance({
  jsonData: {
    org: orgData,
    website: websiteData,
    media: mediaData,
    cycles: cyclesData,
    programGroups: programGroupsData,
    groupAcademic: [nurseryAcademicData],
    workforce: workforceData,
  },
});

// Add media array to org from media.json
// Only include gallery photos (exclude logo which is already in logoPhotoId)
const mediaMap = parseMediaModule(mediaData);
const galleryMediaIds = ["lfk-gallery-1", "lfk-gallery-2"];
LITTLE_FISH_KINDERGARTEN_ORG.org.media = galleryMediaIds
  .map((id) => mediaMap.get(id))
  .filter((media): media is NonNullable<typeof media> => media !== undefined);

// Add supplier recommendations
LITTLE_FISH_KINDERGARTEN_ORG.org.supplierRecommendations = [
  {
    org: EARLY_LEARNERS_BOOKSHELF_ORG.org,
  },
];
