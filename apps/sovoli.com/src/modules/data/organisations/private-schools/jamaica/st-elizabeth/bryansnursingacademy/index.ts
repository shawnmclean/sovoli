import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const BRYAN_S_NURSING_ACADEMY_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Bryan's Nursing Academy",
    categories: ["private-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "Caledonia Mall",
          line2: "Caledonia Road Mandeville P.O.",
          city: "Santa Cruz",
          state: "St. Elizabeth",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1-876-434-8258",
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
