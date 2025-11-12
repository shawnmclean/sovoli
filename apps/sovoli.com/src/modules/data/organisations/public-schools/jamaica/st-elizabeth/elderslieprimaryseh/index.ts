import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const ELDERSLIE_PRIMARY_JUNIOR_HIGH_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Elderslie Primary & Junior High",
    categories: ["public-school", "primary-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "Elderslie District",
          city: "Elderslie P.O.",
          state: "St. Elizabeth",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1-876-334-7770",
            label: "Office",
            isPublic: true,
            primary: true,
          },
          {
            type: "email",
            value: "elderslie.primary.seh@moey.gov.jm",
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
