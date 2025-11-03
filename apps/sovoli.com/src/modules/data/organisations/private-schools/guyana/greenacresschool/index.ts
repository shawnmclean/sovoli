import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const GREEN_ACRES_SCHOOL_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Green Acres School",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: {
          line1: "297 Thomas Street",
          line2: "South Cummingsburg",
          city: "Georgetown",
          countryCode: "GY",
        },
        placeId: "ChIJ3_n5swnvr40R7e4a7ySjUMo",
        contacts: [
          {
            type: "phone",
            value: "+592-225-3583",
            isPublic: true,
            primary: true,
          },
          { type: "phone", value: "+592-225-5568", isPublic: true },
          {
            type: "email",
            value: "rhonda_singh2000@yahoo.com",
            isPublic: true,
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
