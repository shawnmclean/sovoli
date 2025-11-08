import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const ST_VINCENT_STRAMBI_CATHOLIC_HIGH_SCHOOL_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "St. Vincent Strambi Catholic High School",
    categories: ["private-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "Bull Savannah P.O.",
          city: "Bull Savannah",
          state: "St. Elizabeth",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1-876-607-8016",
            label: "Office",
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

