import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const MODERN_FOUNDATION_ACADEMY_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Modern Foundation Academy",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: {
          countryCode: "GY",
        },
        contacts: [],
        isPrimary: true,
      },
    ],
    socialLinks: [
      {
        platform: "facebook",
        url: "https://www.facebook.com/p/Modern-Foundation-Academy-100070923206822/",
      },
    ],
  },
  websiteModule: null,
  academicModule: null,
  serviceModule: null,
  workforceModule: null,
  scoringModule: null,
};

