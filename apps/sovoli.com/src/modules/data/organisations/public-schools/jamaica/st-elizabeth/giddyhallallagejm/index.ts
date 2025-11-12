import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const GIDDY_HALL_ALL_AGE_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Giddy Hall All Age",
    categories: ["public-school", "primary-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "Giddy Hall District",
          city: "Giddy Hall P.O.",
          state: "St. Elizabeth",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1-876-391-0922",
            label: "Office",
            isPublic: true,
            primary: true,
          },
          {
            type: "email",
            value: "giddyhall.allage.seh@moey.gov.jm",
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
