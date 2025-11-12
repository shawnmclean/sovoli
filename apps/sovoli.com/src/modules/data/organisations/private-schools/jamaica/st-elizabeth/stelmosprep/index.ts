import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const ST_ELMO_S_PREPARATORY_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "St. Elmo's Preparatory",
    categories: ["private-school", "nursery-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "147 Main Street",
          city: "Santa Cruz",
          state: "St. Elizabeth",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1-876-966-4204",
            label: "Office",
            isPublic: true,
            primary: true,
          },
          {
            type: "email",
            value: "stelmosprep@gmail.com",
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
