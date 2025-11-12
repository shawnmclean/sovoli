import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const SHEILA_S_PROFESSIONAL_EDUCATION_CENTRE_SPEC_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Sheila's Professional Education Centre (SPEC)",
    categories: ["private-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "New House",
          city: "Rose Hall",
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
