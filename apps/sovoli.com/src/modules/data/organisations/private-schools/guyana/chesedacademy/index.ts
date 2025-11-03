import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const CHESED_ACADEMY_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Chesed Academy",
    categories: ["private-school"],
    socialLinks: [
      {
        platform: "website",
        url: "http://chesedacademy.edu.gy/",
      },
    ],
    locations: [
      {
        key: "main",
        address: {
          line1: "145 Fifth St",
          city: "Georgetown",
          countryCode: "GY",
        },
        placeId: "ChIJCWxqfb7vr40RV1MobA5514I",
        coordinates: {
          lat: 6.8116026,
          lng: -58.1531682,
        },
        contacts: [
          {
            type: "phone",
            value: "+592-650-7584",
            isPublic: true,
            primary: true,
          },
        ],
        isPrimary: true,
      },
    ],
  },
  websiteModule: null,
  academicModule: null,
  serviceModule: null,
  workforceModule: null,
  scoringModule: null,
};
