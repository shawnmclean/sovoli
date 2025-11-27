import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";
import { JABNEH_CHRISTIAN_ACADEMY_NEEDS } from "./needs";
import { JABNEH_CHRISTIAN_ACADEMY_PROJECTS } from "./projects";

export const JABNEH_CHRISTIAN_ACADEMY_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Jabneh Christian Academy",
    isVerified: false,
    verification: {
      status: "pending",
      submittedBy: "system",
      submittedAt: "2025-11-26",
      incorporationDate: undefined,
      notes:
        "Verification pending - will be updated with Jamaica's ministry information. Created from Airtable submissions. Principal: NATASHA FRANCIS-CAMPBELL.",
      documents: [],
    },
    internalCRM: {
      claimStatus: "unclaimed",
      claimedBy: undefined,
      claimedAt: undefined,
      people: [],
    },
    categories: ["private-school", "nursery-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        address: {
          line1: "Sterling, Grange Hill PO",
          city: "Grange Hill P.O.",
          state: "Westmoreland",
          countryCode: "JM",
        },
        placeId: undefined, // Will be updated when location is verified
        coordinates: {
          lat: 18.3, // Approximate coordinates for Westmoreland
          lng: -78.1,
        },
        contacts: [
          {
            type: "phone",
            value: "+18763158983",
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
  needsModule: JABNEH_CHRISTIAN_ACADEMY_NEEDS,
  projectsModule: JABNEH_CHRISTIAN_ACADEMY_PROJECTS,
};
