import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const EASTERN_PREPARATORY_SCHOOL_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Eastern Kindergarten & Preparatory School",
    categories: ["private-school", "nursery-school", "primary-school"],
    verification: {
      status: "pending",
      submittedBy: "system",
      submittedAt: "2025-02-19",
      documents: [],
      notes: "Pending verification with Jamaica’s Ministry of Education for institutional records.",
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
          line1: "27 Windward Road",
          city: "Kingston",
          postalCode: "Kingston 2",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1-876-759-1077",
            label: "Office",
            isPublic: true,
            primary: true,
          },
          {
            type: "email",
            value: "easternpreparatoryschool@gmail.com",
            label: "Admissions",
            isPublic: true,
            primary: true,
          },
        ],
      },
    ],
    socialLinks: [
      { platform: "facebook", url: "https://www.facebook.com/easternpreparatoryschool" },
    ],
  },
  websiteModule: null,
  academicModule: null,
  serviceModule: null,
  workforceModule: null,
  scoringModule: null,
};
