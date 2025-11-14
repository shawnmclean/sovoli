import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";
import { GINGER_HILL_ALL_AGE_NEEDS } from "./needs";
import { GINGER_HILL_ALL_AGE_PROJECTS } from "./projects";

export const GINGER_HILL_ALL_AGE_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Ginger Hill All Age",
    categories: ["public-school", "primary-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "Ginger Hill P.O.",
          state: "St. Elizabeth",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1-876-775-3567",
            label: "Office",
            isPublic: true,
            primary: true,
          },
          {
            type: "email",
            value: "gingerhill.allage.seh@moey.gov.jm",
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
  needsModule: GINGER_HILL_ALL_AGE_NEEDS,
  projectsModule: GINGER_HILL_ALL_AGE_PROJECTS,
};
