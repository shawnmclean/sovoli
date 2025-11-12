import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const SANTA_CRUZ_PRIMARY_JUNIOR_HIGH_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Santa Cruz Primary & Junior High",
    categories: ["public-school", "primary-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "47 Coke Drive",
          city: "Santa Cruz",
          state: "St. Elizabeth",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1-876-966-2986",
            label: "Office",
            isPublic: true,
            primary: true,
          },
          {
            type: "email",
            value: "santacruz.primary.seh@moey.gov.jm",
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
