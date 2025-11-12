import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const MALVERN_COMPUTER_LEARNING_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Malvern Computer Learning",
    categories: ["private-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "Malvern P.O.",
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
