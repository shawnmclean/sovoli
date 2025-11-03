import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const WESTFIELD_PREP_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Westfield Prep Schools",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: {
          line1: "120–121 Parade Street",
          line2: "Kingston",
          city: "Georgetown",
          countryCode: "GY",
        },
        placeId: "ChIJcc5vABLvr40RLorB08nKK9o",
        contacts: [
          {
            type: "phone",
            value: "+592-218-1855",
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
