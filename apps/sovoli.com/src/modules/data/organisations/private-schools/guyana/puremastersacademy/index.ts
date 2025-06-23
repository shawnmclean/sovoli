import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const PURE_MASTERS_ACADEMY_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Pure Masters' Academy",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: {
          line1: "501 Cane View Avenue",
          line2: "South Ruimveldt Gardens",
          city: "georgetown",
          countryCode: "GY",
        },
        contacts: [
          { type: "phone", value: "+592-218-1850", isPublic: true },
          { type: "phone", value: "+592-667-1913", isPublic: true },
          { type: "phone", value: "+592-642-8567", isPublic: true },
        ],
        isPrimary: true,
      },
    ],
    socialLinks: [
      {
        platform: "facebook",
        url: "https://www.facebook.com/Pure-Masters-Academy-100065667692427",
      },
    ],
  },
  websiteModule: null,
  academicModule: null,
  offeringModule: null,
  workforceModule: null,
  scoringModule: null,
};
