import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const SPRINGFIELD_ALL_AGE_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Springfield All Age",
    categories: ["public-school", "primary-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "Springfield P.O.",
          state: "St. Elizabeth",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1-876-775-7195",
            label: "Office",
            isPublic: true,
            primary: true,
          },
          {
            type: "email",
            value: "springfield.allage.seh@moey.gov.jm",
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
