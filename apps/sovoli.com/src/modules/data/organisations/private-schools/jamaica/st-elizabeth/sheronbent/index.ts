import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const GREAT_START_ACADEMY_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Great Start Academy",
    categories: ["private-school", "nursery-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "Market Street",
          city: "Junction P.O",
          state: "St. Elizabeth",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1-876-965-8100",
            label: "Office",
            isPublic: true,
            primary: true,
          },
          {
            type: "email",
            value: "sheronbent@yahoo.com",
            label: "General",
            isPublic: true,
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
