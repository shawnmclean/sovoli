import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const ACADEMIC_TRAINING_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Academic Training Centre",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: {
          line1: "163 Waterloo Street",
          line2: "Cummingsburg",
          city: "Georgetown",
          countryCode: "GY",
        },
        contacts: [
          { type: "phone", value: "+592-225-1585", isPublic: true },
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
