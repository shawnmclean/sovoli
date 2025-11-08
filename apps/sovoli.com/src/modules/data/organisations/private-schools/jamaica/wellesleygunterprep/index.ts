import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const WELLESLEY_GUNTER_PREPARATORY_SCHOOL_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Wellesley Gunter Preparatory School",
    categories: ["private-school", "primary-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "131 Main Street",
          city: "Santa Cruz",
          state: "St. Elizabeth",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1-876-867-8430",
            label: "Office",
            isPublic: true,
            primary: true,
          },
          {
            type: "phone",
            value: "+1-876-725-1234",
            label: "Office",
            isPublic: true,
          },
        ],
      },
    ],
    socialLinks: [
      {
        platform: "website",
        url: "https://wellesleygp.com",
      },
    ],
  },
  websiteModule: null,
  academicModule: null,
  serviceModule: null,
  workforceModule: null,
  scoringModule: null,
};

