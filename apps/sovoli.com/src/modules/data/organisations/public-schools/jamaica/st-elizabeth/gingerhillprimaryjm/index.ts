import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";
import { GINGER_HILL_PRIMARY_NEEDS } from "./needs";
import { GINGER_HILL_PRIMARY_PROJECTS } from "./projects";

export const GINGER_HILL_PRIMARY_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Ginger Hill Primary School",
    isVerified: false,
    verification: {
      status: "pending",
      submittedBy: "system",
      submittedAt: "2025-11-27",
      incorporationDate: undefined,
      notes:
        "Verification pending - will be updated with Jamaica's ministry information. Created from Airtable submissions. Contact: Sherreen Smith (Teacher).",
      documents: [],
    },
    internalCRM: {
      claimStatus: "unclaimed",
      claimedBy: undefined,
      claimedAt: undefined,
      people: [],
    },
    categories: ["public-school", "primary-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "Ginger Hill District",
          city: "Ginger Hill/ Providence District",
          state: "St. Elizabeth",
          countryCode: "JM",
        },
        placeId: undefined, // Will be updated when location is verified
        coordinates: {
          lat: 18.0, // Approximate coordinates for St. Elizabeth
          lng: -77.9,
        },
        contacts: [
          {
            type: "phone",
            value: "+18765875427",
            label: "School",
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
  needsModule: GINGER_HILL_PRIMARY_NEEDS,
  projectsModule: GINGER_HILL_PRIMARY_PROJECTS,
};
