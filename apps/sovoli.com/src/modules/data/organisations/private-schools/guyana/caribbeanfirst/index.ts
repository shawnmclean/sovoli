import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const CARIBBEAN_FIRST_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Caribbean First Class Elementary",
    categories: ["private-school"],
    socialLinks: [
      {
        platform: "website",
        url: "http://cfces.net/",
      },
      {
        platform: "facebook",
        url: "https://www.facebook.com/caribbeanfirstclasselementary",
      },
      {
        platform: "instagram",
        url: "https://www.instagram.com/CaribbeanFirstClassElementary",
      },
    ],
    locations: [
      {
        key: "main",
        address: {
          line1: "168 Charlotte St",
          city: "georgetown",
          countryCode: "GY",
        },
        placeId: "ChIJhwAoewnvr40RQyEEfNsrK_o",
        contacts: [
          {
            type: "phone",
            value: "+592-231-4164",
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
