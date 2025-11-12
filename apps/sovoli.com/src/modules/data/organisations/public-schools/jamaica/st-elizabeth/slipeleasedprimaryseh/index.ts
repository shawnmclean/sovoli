import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const SLIPE_LEASED_PRIMARY_AND_INFANT_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Slipe Leased Primary and Infant",
    categories: ["public-school", "primary-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "Slipe District",
          city: "Slipe P.A",
          state: "St. Elizabeth",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1-876-578-3784",
            label: "Office",
            isPublic: true,
            primary: true,
          },
          {
            type: "email",
            value: "slipeleased.primary.seh@moey.gov.jm",
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
