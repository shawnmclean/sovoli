import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const JUNCTION_ACADEMIC_INSTITUTE_OF_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Junction Academic Institute of",
    categories: ["private-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "Junction P.O.",
          state: "St. Elizabeth",
          countryCode: "JM",
        },
        contacts: [],
      },
    ],
  },
  websiteModule: null,
  academicModule: null,
  serviceModule: null,
  workforceModule: null,
  scoringModule: null,
};
