import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";
import { JOHN_JOYCE_WATSON_ECI_NEEDS } from "./needs";
import { JOHN_JOYCE_WATSON_ECI_PROJECTS } from "./projects";

export const JOHN_JOYCE_WATSON_ECI_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "John Joyce Watson ECI",
    categories: ["private-school", "nursery-school"],
    isVerified: true,
    verification: {
      status: "verified",
      submittedBy: "De'Andra Wright",
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
          line1: "Wedtgree P.O. Box 514 Montego Bay",
          city: "",
          state: "St. James",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1 (876) 893-0668",
            label: "Principal De'Andra Wright",
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
  needsModule: JOHN_JOYCE_WATSON_ECI_NEEDS,
  projectsModule: JOHN_JOYCE_WATSON_ECI_PROJECTS,
};
