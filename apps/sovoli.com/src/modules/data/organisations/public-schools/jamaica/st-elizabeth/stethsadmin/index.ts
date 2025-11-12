import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const ST_ELIZABETH_TECHNICAL_HIGH_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "St. Elizabeth Technical High",
    categories: ["public-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "90 Main Street",
          line2: "P.O. Box 645",
          city: "Santa Cruz",
          state: "St. Elizabeth",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1-876-966-9802",
            label: "Office",
            isPublic: true,
            primary: true,
          },
          {
            type: "email",
            value: "stethsadmin@cwjamaica.com",
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
