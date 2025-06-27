import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";
import { THE_NEW_GUYANA_ACADEMIC } from "./academic";

export const THE_NEW_GUYANA_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "The New Guyana School",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: {
          line1: "Houston Gardens",
          line2: "Greater Georgetown",
          city: "Georgetown",
          countryCode: "GY",
        },
        contacts: [
          { type: "phone", value: "+592-225-2135", isPublic: true },
          { type: "phone", value: "+592-225-1807", isPublic: true },
          {
            type: "email",
            value: "admin@newguyanaschool.edu.gy",
            isPublic: true,
          },
        ],
        isPrimary: true,
      },
    ],
  },
  websiteModule: null,
  academicModule: THE_NEW_GUYANA_ACADEMIC,
  offeringModule: null,
  workforceModule: null,
  scoringModule: null,
};
