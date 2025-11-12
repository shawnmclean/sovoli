import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const LITITZ_ALL_AGE_AND_INFANT_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Lititz All Age and Infant",
    categories: ["public-school", "primary-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "Watson Hill P.O.",
          state: "St. Elizabeth",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1-876-963-6712",
            label: "Office",
            isPublic: true,
            primary: true,
          },
          {
            type: "email",
            value: "lititz.allage.seh@moey.gov.jm",
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
