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
          city: "georgetown",
          countryCode: "GY",
        },
        placeId: "ChIJj2Ap0ubvr40RMkhZ-HxfTIk",
        contacts: [
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
  serviceModule: null,
  workforceModule: null,
  scoringModule: null,
};
