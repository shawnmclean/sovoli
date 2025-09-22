import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const ARK_OF_CHRIST_PREPARATORY_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Ark of Christ Preparatory School",
    categories: ["private-school", "primary-school"],
    verification: {
      status: "pending",
      submittedBy: "system",
      submittedAt: "2025-02-19",
      documents: [],
      notes: "Awaiting supporting documents from the school and affiliated church organisation.",
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
          line1: "45 Last Street",
          city: "Kingston",
          postalCode: "Kingston 14",
          countryCode: "JM",
        },
        contacts: [],
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
