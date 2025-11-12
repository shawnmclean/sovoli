import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const ST_MARYS_PRIMARY_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "St. Marys Primary",
    categories: ["public-school", "primary-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "St. Marys District",
          city: "Munro College P.O.",
          state: "St. Elizabeth",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1-876-812-5949",
            label: "Office",
            isPublic: true,
            primary: true,
          },
          {
            type: "email",
            value: "stmary.primary.seh@moey.gov.jm",
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
