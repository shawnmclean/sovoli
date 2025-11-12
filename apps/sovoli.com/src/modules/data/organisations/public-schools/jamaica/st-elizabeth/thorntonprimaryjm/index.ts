import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const THORNTON_PRIMARY_AND_INFANT_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Thornton Primary and Infant",
    categories: ["public-school", "primary-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "Thornton District",
          city: "Thornton P.A.",
          state: "St. Elizabeth",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1-876-607-3797",
            label: "Office",
            isPublic: true,
            primary: true,
          },
          {
            type: "email",
            value: "thornton.primary.seh@moey.gov.jm",
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
