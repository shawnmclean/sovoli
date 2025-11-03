import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const GEORGETOWN_INTERNATIONAL_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Georgetown International Academy",
    categories: ["private-school"],
    socialLinks: [
      {
        platform: "website",
        url: "https://www.giagy.com/",
      },
      {
        platform: "facebook",
        url: "https://www.facebook.com/giagy.org",
      },
    ],
    locations: [
      {
        key: "main",
        address: {
          line1: "TRACT 'C' BLOCK XXX,SOUTH, Railway Embankment Rd",
          city: "georgetown",
          countryCode: "GY",
        },
        placeId: "ChIJKTVL4O_ur40RjNikFc6s0bU",
        contacts: [
          {
            type: "phone",
            value: "+592-225-8347",
            isPublic: true,
            primary: true,
          },
          { type: "phone", value: "+592-226-1595", isPublic: true },
          { type: "email", value: "admissions@giagy.org", isPublic: true },
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
