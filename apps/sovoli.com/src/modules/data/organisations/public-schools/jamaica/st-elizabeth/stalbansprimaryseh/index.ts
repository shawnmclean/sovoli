import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const ST_ALBANS_PRIMARY_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "St. Albans Primary",
    categories: ["public-school", "primary-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "Stanmore District",
          city: "Malvern P.O.",
          state: "St. Elizabeth",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1-876-269-1656",
            label: "Office",
            isPublic: true,
            primary: true,
          },
          {
            type: "email",
            value: "stalbans.primary.seh@moey.gov.jm",
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
