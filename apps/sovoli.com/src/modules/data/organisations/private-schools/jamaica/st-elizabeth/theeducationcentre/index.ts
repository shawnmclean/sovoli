import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const THE_EDUCATION_CENTRE_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "The Education Centre",
    categories: ["private-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "11 Arc Manifest Plaza",
          city: "Santa Cruz",
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
