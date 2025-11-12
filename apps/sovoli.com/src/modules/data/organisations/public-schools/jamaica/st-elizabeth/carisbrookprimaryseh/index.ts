import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const CARISBROOK_PRIMARY_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Carisbrook Primary",
    categories: ["public-school", "primary-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "Carisbrook District",
          city: "Carisbrook P.A.",
          state: "St. Elizabeth",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "email",
            value: "carisbrook.primary.seh@moey.gov.jm",
            label: "General",
            isPublic: true,
            primary: true,
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
