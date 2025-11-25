import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";
import { COVE_PRIMARY_NEEDS } from "./needs";
import { COVE_PRIMARY_PROJECTS } from "./projects";

export const COVE_PRIMARY_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Cove Primary",
    isVerified: false,
    verification: {
      status: "pending",
      submittedBy: "system",
      submittedAt: "2025-11-24",
      incorporationDate: undefined,
      notes:
        "Verification pending - will be updated with Jamaica's ministry information. Created from Airtable submissions.",
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
        address: {
          line1: "Cousins Cove, Green Island P.O",
          city: "Cousins Cove",
          state: "Hanover",
          countryCode: "JM",
        },
        placeId: undefined, // Will be updated when location is verified
        coordinates: {
          lat: 18.4, // Approximate coordinates for Hanover
          lng: -78.2,
        },
        contacts: [
          {
            type: "phone",
            value: "+18762828709",
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
  needsModule: COVE_PRIMARY_NEEDS,
  projectsModule: COVE_PRIMARY_PROJECTS,
};
