import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const FAITHVILLE_PREPARATORY_SCHOOL_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Faithville Kindergarten & Preparatory School",
    categories: ["private-school", "nursery-school", "primary-school"],
    verification: {
      status: "pending",
      submittedBy: "system",
      submittedAt: "2025-02-19",
      documents: [],
      notes: "Awaiting confirmation of registration details from Faithville’s leadership team.",
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
          line1: "22 Ocean View Avenue",
          city: "Kingston",
          postalCode: "Kingston 2",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1-876-930-6534",
            label: "Office",
            isPublic: true,
            primary: true,
          },
          {
            type: "email",
            value: "faithvilleprep@gmail.com",
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
