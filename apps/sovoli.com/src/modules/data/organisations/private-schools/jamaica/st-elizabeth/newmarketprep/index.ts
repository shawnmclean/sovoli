import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const NEW_MARKET_PREP_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "New Market Prep",
    categories: ["private-school", "nursery-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "New Market P.O.",
          state: "St. Elizabeth",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1-876-361-7798",
            label: "Office",
            isPublic: true,
            primary: true,
          },
          {
            type: "email",
            value: "newmarketprep@yahoo.com",
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
