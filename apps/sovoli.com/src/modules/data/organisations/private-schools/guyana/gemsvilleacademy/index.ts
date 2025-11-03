import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const GEMSVILLE_ACADEMY_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Gemsville Academy",
    categories: ["private-school"],
    socialLinks: [
      {
        platform: "facebook",
        url: "https://www.facebook.com/Gemsville.Academy",
      },
    ],
    locations: [
      {
        key: "main",
        address: {
          line1: "Durban St",
          city: "georgetown",
          countryCode: "GY",
        },
        placeId: "ChIJ7za27ATvr40RbJEL4kFrVJ8",
        contacts: [
          {
            type: "phone",
            value: "+592-231-7227",
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
