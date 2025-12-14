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
import sewingAcademicData from "./sewing-academic.json";
import workshopsAcademicData from "./workshops-academic.json";

/**
 * FitRight Academy organization instance
 * All data loaded from JSON files and parsed using the parser utilities
 */
export const FITRIGHT_ORG: OrgInstance = parseOrgInstance({
  jsonData: {
    org: orgData,
    media: mediaData,
    workforce: workforceData,
    cycles: cyclesData,
    programGroups: programGroupsData,
    groupAcademic: [sewingAcademicData, workshopsAcademicData],
    website: websiteData,
  },
});

// Add programsPageHero and defaultSocialProof to website module
// These are not part of the website.json schema but are part of WebsiteModule
const parsedWebsiteModule = parseWebsiteModule(websiteData, orgData.username);

FITRIGHT_ORG.websiteModule = {
  ...parsedWebsiteModule,
  programsPageHero: {
    headline: "Master the Art of Dressmaking and Design",
    subtext:
      "Find the perfect program to launch your career in fashion and tailoring.",
    socialProof: {
      count: "50+",
      audienceLabel: "students",
      locationContext: "in Georgetown, Guyana",
    },
  },
  defaultSocialProof: {
    count: "50+",
    audienceLabel: "students",
  },
};

// Add media array to org from media.json
// Only include gallery photos (exclude logo which is already in logoPhoto)
const mediaMap = parseMediaModule(mediaData);
const galleryMediaIds = [
  "fitright-bag-workshop-1",
  "fitright-bag-workshop-2",
  "fitright-elementary-sewing-1",
  "fitright-elementary-sewing-2",
  "fitright-elementary-sewing-3",
  "fitright-elementary-sewing-4",
  "fitright-elementary-sewing-5",
];
FITRIGHT_ORG.org.media = galleryMediaIds
  .map((id) => mediaMap.get(id))
  .filter((media): media is NonNullable<typeof media> => media !== undefined);
