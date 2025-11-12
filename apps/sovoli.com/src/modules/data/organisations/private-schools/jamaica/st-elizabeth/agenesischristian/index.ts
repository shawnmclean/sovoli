import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const GENESIS_CHRISTIAN_ACADEMY_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Genesis Christian Academy",
    categories: ["private-school", "nursery-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "Pepper P.O.",
          state: "St. Elizabeth",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "email",
            value: "agenesischristian@yahoo.com",
            label: "General",
            isPublic: true,
            primary: true,
          },
        ],
      },
    ],
  },
  websiteModule: null,
  academicModule: null,
  serviceModule: null,
  workforceModule: null,
  scoringModule: null,
};
