import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";
import { BEZER_BASIC_SCHOOL_NEEDS } from "./needs";
import { BEZER_BASIC_SCHOOL_PROJECTS } from "./projects";

export const BEZER_BASIC_SCHOOL_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Bezer Basic School",
    isVerified: false,
    verification: {
      status: "pending",
      submittedBy: "system",
      submittedAt: "2025-11-26",
      incorporationDate: undefined,
      notes:
        "Verification pending - will be updated with Jamaica's ministry information. Created from Airtable submissions. Board Member: Tavon Bryan.",
      documents: [],
    },
    internalCRM: {
      claimStatus: "unclaimed",
      claimedBy: undefined,
      claimedAt: undefined,
      people: [],
    },
    categories: ["public-school", "nursery-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        address: {
          line1: "Clayground District",
          city: "Bamboo P.O",
          state: "St. Ann",
          countryCode: "JM",
        },
        placeId: undefined, // Will be updated when location is verified
        coordinates: {
          lat: 18.4, // Approximate coordinates for St. Ann
          lng: -77.4,
        },
        contacts: [
          {
            type: "phone",
            value: "+18765425334",
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
  needsModule: BEZER_BASIC_SCHOOL_NEEDS,
  projectsModule: BEZER_BASIC_SCHOOL_PROJECTS,
};
