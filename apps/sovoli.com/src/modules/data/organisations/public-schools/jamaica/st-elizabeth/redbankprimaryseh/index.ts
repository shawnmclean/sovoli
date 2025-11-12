import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const RED_BANK_PRIMARY_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Red Bank Primary",
    categories: ["public-school", "primary-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "Red Bank District",
          city: "Red Bank P.A",
          state: "St. Elizabeth",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1-876-366-0628",
            label: "Office",
            isPublic: true,
            primary: true,
          },
          {
            type: "email",
            value: "redbank.primary.seh@moey.gov.jm",
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
