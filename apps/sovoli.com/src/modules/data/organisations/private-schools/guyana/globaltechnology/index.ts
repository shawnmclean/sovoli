import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const GLOBAL_TECHNOLOGY_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Global Technology",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: {
          line1: "210 Camp Street & New Market Street North",
          city: "Georgetown",
          countryCode: "GY",
        },
        placeId: "ChIJozT46g7vr40RkD5N3M5y-VU",
        contacts: [{ type: "phone", value: "+592-225-4657", isPublic: true }],
        isPrimary: true,
      },
    ],
    socialLinks: [
      {
        platform: "facebook",
        url: "https://www.facebook.com/GlobalTechnologyInc/",
      },
    ],
  },
  websiteModule: null,
  academicModule: null,
  serviceModule: null,
  workforceModule: null,
  scoringModule: null,
};
