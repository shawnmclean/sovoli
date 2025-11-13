import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const SANTA_CRUZ_PREPARATORY_SCHOOL_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Santa Cruz Preparatory School",
    categories: ["private-school", "primary-school"],
    internalCRM: {
      people: [
        {
          name: "Mrs. Hyacinth Stubbs",
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
          line1: "Coke Drive",
          line2: "P.O. Box 718",
          city: "Santa Cruz",
          state: "St. Elizabeth",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1-876-966-2153",
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
