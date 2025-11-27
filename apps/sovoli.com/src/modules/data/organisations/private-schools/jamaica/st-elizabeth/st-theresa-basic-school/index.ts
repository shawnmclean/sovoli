import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";
import { ST_THERESA_BASIC_SCHOOL_NEEDS } from "./needs";
import { ST_THERESA_BASIC_SCHOOL_PROJECTS } from "./projects";

export const ST_THERESA_BASIC_SCHOOL_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "St Theresa basic school",
    isVerified: false,
    verification: {
      status: "pending",
      submittedBy: "system",
      submittedAt: "2025-11-26",
      incorporationDate: undefined,
      notes:
        "Verification pending - will be updated with Jamaica's ministry information. Created from Airtable submissions. Principal: Sr Juliet Nyaga ASN.",
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
          line1: "68 High Street, Blackriver. St Elizabeth",
          city: "Blackriver",
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
            value: "+187618765706924",
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
  needsModule: ST_THERESA_BASIC_SCHOOL_NEEDS,
  projectsModule: ST_THERESA_BASIC_SCHOOL_PROJECTS,
};
