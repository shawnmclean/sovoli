import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const HOPEWELL_PREPARATORY_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Hopewell Preparatory",
    categories: ["private-school", "nursery-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "56 Coke Drive",
          city: "Santa Cruz P.O.",
          state: "St. Elizabeth",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1-876-966-2610",
            label: "Office",
            isPublic: true,
            primary: true,
          },
          {
            type: "email",
            value: "hopewelleci_prep@yahoo.com",
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
