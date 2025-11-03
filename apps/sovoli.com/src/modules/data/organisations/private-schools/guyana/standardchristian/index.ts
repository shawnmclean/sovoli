import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const STANDARD_CHRISTIAN_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Standard Christian Academy",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: {
          line1: "45 Arapaima St",
          city: "georgetown",
          countryCode: "GY",
        },
        placeId: "ChIJwUjmaa_vr40RF07eimgf4wU",
        contacts: [{ type: "phone", value: "+592-642-4913", isPublic: true }],
        isPrimary: true,
      },
    ],
    socialLinks: [
      {
        platform: "facebook",
        url: "https://www.facebook.com/standardchristianacademy",
      },
    ],
  },
  websiteModule: null,
  academicModule: null,
  serviceModule: null,
  workforceModule: null,
  scoringModule: null,
};
