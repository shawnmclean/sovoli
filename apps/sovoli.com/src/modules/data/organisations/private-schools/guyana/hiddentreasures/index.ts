import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const HIDDEN_TREASURES_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Hidden Treasures Academy",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: {
          line1: "204 East Half Charlotte Street",
          line2: "between Camp & Alexander (3 buildings away from Kester D music house)",
          city: "georgetown",
          countryCode: "GY",
        },
        placeId: "ChIJZ3_U8szvr40RqkaU0w37hE0",
        contacts: [{ type: "phone", value: "+592-675-4379", isPublic: true }],
        isPrimary: true,
      },
    ],
    socialLinks: [
      {
        platform: "facebook",
        url: "https://www.facebook.com/Hiddentreasuresacademy",
      },
    ],
  },
  websiteModule: null,
  academicModule: null,
  serviceModule: null,
  workforceModule: null,
  scoringModule: null,
};
