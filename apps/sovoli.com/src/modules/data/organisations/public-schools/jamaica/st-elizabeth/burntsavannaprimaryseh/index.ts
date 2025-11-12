import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const BURNT_SAVANNAH_PRIMARY_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Burnt Savannah Primary",
    categories: ["public-school", "primary-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "Burnt Savannah District",
          city: "Burnt Savannah P.A.",
          state: "St. Elizabeth",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1-876-781-6567",
            label: "Office",
            isPublic: true,
            primary: true,
          },
          {
            type: "email",
            value: "burntsavanna.primary.seh@moey.gov.jm",
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
