import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const BLACK_RIVER_PREPARATORY_SCHOOL_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Black River Preparatory School",
    categories: ["private-school", "primary-school"],
    internalCRM: {
      people: [
        {
          name: "Mrs. Icylin Malcolm",
          notes: "Principal",
          contacts: [],
        },
      ],
    },
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "40 Central Road",
          city: "Black River",
          state: "St. Elizabeth",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1-876-634-3695",
            label: "Office",
            isPublic: true,
            primary: true,
          },
        ],
      },
    ],
    socialLinks: [],
  },
  websiteModule: null,
  academicModule: null,
  serviceModule: null,
  workforceModule: null,
  scoringModule: null,
};

