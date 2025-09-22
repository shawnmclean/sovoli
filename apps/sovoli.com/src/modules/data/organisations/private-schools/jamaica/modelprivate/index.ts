import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const MODEL_PRIVATE_PREPARATORY_SCHOOL_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Model Private Preparatory School",
    categories: ["private-school", "primary-school"],
    verification: {
      status: "pending",
      submittedBy: "system",
      submittedAt: "2025-02-19",
      documents: [],
      notes: "Awaiting official documentation from the school’s administrators.",
    },
    internalCRM: {
      claimStatus: "unclaimed",
      people: [],
    },
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "2 Bakers Street",
          line2: "Jones Town",
          city: "Kingston",
          postalCode: "Kingston 12",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1-876-302-8393",
            label: "Office",
            isPublic: true,
            primary: true,
          },
          {
            type: "email",
            value: "modelprivate@gmail.com",
            label: "Admissions",
            isPublic: true,
            primary: true,
          },
        ],
      },
    ],
    socialLinks: [],
  },
  websiteModule: null,
  academicModule: null,
  serviceModule: null,
  workforceModule: null,
  scoringModule: null,
};
