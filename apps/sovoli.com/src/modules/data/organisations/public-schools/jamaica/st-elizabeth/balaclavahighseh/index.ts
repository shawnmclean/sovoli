import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const ROGER_CLARKE_HIGH_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Roger Clarke High",
    categories: ["public-school", "primary-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "Balaclava",
          city: "Balaclava P.O.",
          state: "St. Elizabeth",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1-876-963-2223",
            label: "Office",
            isPublic: true,
            primary: true,
          },
          {
            type: "email",
            value: "balaclava.high.seh@moey.gov.jm",
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
