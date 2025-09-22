import type { OrgInstance } from "~/modules/organisations/types";

import { READING_EXPRESS_ACADEMIC } from "./academic";
import { ORG_USERNAME } from "./constants";

export const READING_EXPRESS_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Reading Express",
    categories: ["private-school", "special-education-school"],
    verification: {
      status: "pending",
      submittedBy: "system",
      submittedAt: "2025-02-19",
      documents: [],
      notes: "Pending verification of business registration for the literacy centre.",
    },
    internalCRM: {
      claimStatus: "unclaimed",
      people: [
        {
          name: "Maxine Mitchell",
          contacts: [],
          notes: "Founder and CEO; literacy specialist leading the Reading Express team.",
        },
      ],
    },
    locations: [
      {
        key: "main-campus",
        label: "Learning Studio",
        isPrimary: true,
        address: {
          line1: "Shop 7C, Regal Plaza",
          line2: "Cross Roads",
          city: "Kingston",
          postalCode: "Kingston 5",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1-876-478-1211",
            label: "Office",
            isPublic: true,
            primary: true,
          },
        ],
      },
    ],
    socialLinks: [
      { platform: "facebook", url: "https://www.facebook.com/readingexpressjm" },
      { platform: "instagram", url: "https://www.instagram.com/readingexpressjm" },
    ],
  },
  websiteModule: null,
  academicModule: READING_EXPRESS_ACADEMIC,
  serviceModule: null,
  workforceModule: null,
  scoringModule: null,
};
