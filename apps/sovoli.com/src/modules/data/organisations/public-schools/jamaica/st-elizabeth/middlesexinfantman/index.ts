import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const MIDDLESEX_INFANT_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Middlesex Infant",
    categories: ["public-school", "nursery-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "Middlesex District",
          city: "Middlesex P.A",
          state: "St. Elizabeth",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1-876-428-1156",
            label: "Office",
            isPublic: true,
            primary: true,
          },
          {
            type: "email",
            value: "middlesex.infant.man@moey.gov.jm",
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
