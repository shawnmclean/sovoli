import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";
import { OLYMPUS_ACADEMY_NEEDS } from "./needs";
import { OLYMPUS_ACADEMY_PROJECTS } from "./projects";

export const OLYMPUS_ACADEMY_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Olympus Academy",
    categories: ["private-school", "primary-school"],
    isVerified: true,
    verification: {
      status: "verified",
      submittedBy: "Principal",
      submittedAt: "2025-11-21",
      verifiedAt: "2025-11-21",
      documents: [],
    },
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "Lot 31 Pimento Hill",
          line2: "Great River Water Treatment Plant",
          city: "Unity Hall",
          state: "St. James",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1 (876) 586-6193",
            label: "Principal",
            isPublic: true,
            primary: true,
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
  needsModule: OLYMPUS_ACADEMY_NEEDS,
  projectsModule: OLYMPUS_ACADEMY_PROJECTS,
};
