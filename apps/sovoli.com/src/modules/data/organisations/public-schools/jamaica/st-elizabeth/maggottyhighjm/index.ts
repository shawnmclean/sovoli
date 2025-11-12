import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const MAGGOTTY_HIGH_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Maggotty High",
    categories: ["public-school", "primary-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "Maggotty",
          city: "Maggotty P.O.",
          state: "St. Elizabeth",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1-876-997-2900",
            label: "Office",
            isPublic: true,
            primary: true,
          },
          {
            type: "email",
            value: "maggotty.high.seh@moey.gov.jm",
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
