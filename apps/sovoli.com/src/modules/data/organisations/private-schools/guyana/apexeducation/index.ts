import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const APEX_EDUCATION_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Apex Education",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: {
          line1: "11 Public Road",
          line2: "Vryheids Lust North, East Coast Demerara",
          city: "Georgetown",
          countryCode: "GY",
        },
        placeId: "ChIJRSkgg7rtr40RkOmXRc1sNBk",
        coordinates: {
          lat: 6.8203095,
          lng: -58.0895078,
        },
        contacts: [
          { type: "phone", value: "+592-220-6139", isPublic: true },
          { type: "email", value: "apexeducation@yahoo.com", isPublic: true },
        ],
        isPrimary: true,
      },
    ],
    socialLinks: [
      {
        platform: "facebook",
        url: "https://www.facebook.com/p/Apex-Education-100063756137169/",
      },
    ],
  },
  websiteModule: null,
  academicModule: null,
  serviceModule: null,
  workforceModule: null,
  scoringModule: null,
};
