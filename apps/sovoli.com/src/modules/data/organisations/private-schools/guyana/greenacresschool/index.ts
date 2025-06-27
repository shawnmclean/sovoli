import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";
import { GREEN_ACRES_SCHOOL_ACADEMIC } from "./academic";

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
        contacts: [
          { type: "phone", value: "+592-225-3583", isPublic: true },
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
  academicModule: GREEN_ACRES_SCHOOL_ACADEMIC,
  offeringModule: null,
  workforceModule: null,
  scoringModule: null,
};
