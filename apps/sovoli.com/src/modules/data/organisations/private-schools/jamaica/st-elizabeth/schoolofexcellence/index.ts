import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const SCHOOL_OF_EXCELLENCE_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "School of Excellence",
    categories: ["private-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "56 Main Street",
          city: "Santa Cruz",
          state: "St. Elizabeth",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1-876-754-4705",
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
