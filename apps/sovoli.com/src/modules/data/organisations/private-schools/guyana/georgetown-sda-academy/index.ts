import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const GEORGETOWN_SDA_ACADEMY_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Georgetown Seventh-day Adventist Academy",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: {
          line1: "D’Urban Backlands",
          line2: "Opp. Davis Memorial Hospital",
          city: "Georgetown",
          countryCode: "GY",
        },
        contacts: [
          { type: "email", value: "info@guyanaconference.org", isPublic: true },
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


