import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const BETHLEHEM_MORAVIAN_COLLEGE_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Bethlehem Moravian College",
    categories: ["public-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "Malvern",
          city: "St. Elizabeth Jamaica W.I.",
          state: "St. Elizabeth",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1-876-966-5293",
            label: "Office",
            isPublic: true,
            primary: true,
          },
          {
            type: "email",
            value: "bethlehem@bmc.edu.jm",
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
