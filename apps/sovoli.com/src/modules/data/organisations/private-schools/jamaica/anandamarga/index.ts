import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const ANANDA_MARGA_SCHOOL_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Ananda Marga Kindergarten & Preparatory School",
    categories: ["private-school", "nursery-school", "primary-school"],
    verification: {
      status: "pending",
      submittedBy: "system",
      submittedAt: "2025-02-19",
      documents: [],
      notes: "Awaiting incorporation details from the Ananda Marga organisation in Jamaica.",
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
          line1: "12 Crieffe Road",
          city: "Kingston",
          postalCode: "Kingston 6",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1-876-927-8969",
            label: "Office",
            isPublic: true,
            primary: true,
          },
          {
            type: "email",
            value: "anandamarga79@yahoo.com",
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
