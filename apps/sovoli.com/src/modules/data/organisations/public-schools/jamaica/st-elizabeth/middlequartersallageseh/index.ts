import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const MIDDLE_QUARTERS_ALL_AGE_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Middle Quarters All Age",
    categories: ["public-school", "primary-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "Middle Quarters District",
          city: "Middle Quarters P.O.",
          state: "St. Elizabeth",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1-876-899-1323",
            label: "Office",
            isPublic: true,
            primary: true,
          },
          {
            type: "email",
            value: "middlequarters.allage.seh@moey.gov.jm",
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
