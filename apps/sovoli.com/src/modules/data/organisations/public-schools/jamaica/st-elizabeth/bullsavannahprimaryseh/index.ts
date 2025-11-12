import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const BULL_SAVANNAH_PRIMARY_AND_INFANT_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Bull Savannah Primary and Infant",
    categories: ["public-school", "primary-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "Bull Savannah District",
          city: "Bull Savannah P.A.",
          state: "St. Elizabeth",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1-876-965-8786",
            label: "Office",
            isPublic: true,
            primary: true,
          },
          {
            type: "email",
            value: "bullsavannah.primary.seh@moey.gov.jm",
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
