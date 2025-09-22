import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const NEW_HOPE_PREPARATORY_SCHOOL_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "New Hope Preparatory School",
    categories: ["private-school", "primary-school"],
    verification: {
      status: "pending",
      submittedBy: "system",
      submittedAt: "2025-02-19",
      documents: [],
      notes: "Awaiting verification with the New Hope church administration in Kingston.",
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
          line1: "56 James Street",
          city: "Kingston",
          postalCode: "Kingston 2",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1-876-922-6507",
            label: "Office",
            isPublic: true,
            primary: true,
          },
          {
            type: "email",
            value: "newhopeprep@yahoo.com",
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
