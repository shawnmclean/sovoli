import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const BROMPTON_PRIMARY_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Brompton Primary",
    categories: ["public-school", "primary-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "Brompton",
          city: "Fyffes Pen P.O.",
          state: "St. Elizabeth",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1-876-827-4512",
            label: "Office",
            isPublic: true,
            primary: true,
          },
          {
            type: "email",
            value: "brompton.primary.seh@moey.gov.jm",
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
