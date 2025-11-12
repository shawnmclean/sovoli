import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const BULL_SAVANNAH_PREPARATORY_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Bull Savannah Preparatory",
    categories: ["private-school", "nursery-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "Bull Savannah P.O.",
          state: "St. Elizabeth",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1-876-429-2455",
            label: "Office",
            isPublic: true,
            primary: true,
          },
          {
            type: "email",
            value: "bullsavannah_prepschool@yahoo.com",
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
