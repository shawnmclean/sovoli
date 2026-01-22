import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";
import { WILLIAMS_ELITE_ACADEMY_NEEDS } from "./needs";
import { WILLIAMS_ELITE_ACADEMY_PROJECTS } from "./projects";

export const WILLIAMS_ELITE_ACADEMY_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Williams Elite Academy",
    isVerified: false,
    verification: {
      status: "pending",
      submittedBy: "system",
      submittedAt: "2025-11-26",
      incorporationDate: undefined,
      notes:
        "Verification pending - will be updated with Jamaica's ministry information. Created from Airtable submissions. Principal: Nadine Williams.",
      documents: [],
    },
    internalCRM: {
      claimStatus: "unclaimed",
      claimedBy: undefined,
      claimedAt: undefined,
      people: [],
    },
    categories: ["private-school", "primary-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        address: {
          line1: "8 Coke Avenue, Brandon Hill",
          city: "Montego Bay",
          state: "St. James",
          countryCode: "JM",
        },
        placeId: undefined, // Will be updated when location is verified
        coordinates: {
          lat: 18.5, // Approximate coordinates for St. James
          lng: -77.9,
        },
        contacts: [
          {
            type: "phone",
            value: "+18768505544",
            label: "School",
            isPublic: true,
            primary: true,
          },
        ],
        isPrimary: true,
      },
    ],
    socialLinks: [],
  },
  websiteModule: null,
  academicModule: null,
  serviceModule: null,
  workforceModule: null,
  scoringModule: null,
  needsModule: WILLIAMS_ELITE_ACADEMY_NEEDS,
  projectsModule: WILLIAMS_ELITE_ACADEMY_PROJECTS,
};
