import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const MARANATHA_SCHOOL_FOR_THE_DEAF_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Maranatha School for the Deaf",
    categories: ["private-school", "special-education-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "Top Hill",
          state: "St. Elizabeth",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1-876-965-1738",
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
