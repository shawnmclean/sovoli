import type { OrgInstance } from "~/modules/organisations/types";
import { OrgLocationFeature } from "~/modules/organisations/types";
import { APPLETON_BASIC_SCHOOL_ACADEMIC } from "./academic";
import { ORG_USERNAME } from "./constants";
import { APPLETON_BASIC_SCHOOL_OFFERINGS } from "./offering";
import { APPLETON_BASIC_SCHOOL_WORKFORCE } from "./workforce";
import { APPLETON_BASIC_SCHOOL_WEBSITE } from "./website";

export const APPLETON_BASIC_SCHOOL_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Appleton Basic School",
    logo: "/orgs/absjm/logo.webp",
    isVerified: false,
    verification: {
      status: "pending",
      submittedBy: "system",
      submittedAt: "2025-01-27",
      incorporationDate: undefined,
      notes:
        "Verification pending - will be updated with Jamaica's ministry information",
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
          line1: "Appleton Estate",
          city: "St. Elizabeth",
          countryCode: "JM",
          landmark: "Near Appleton Estate",
        },
        placeId: undefined, // Will be updated when location is verified
        coordinates: {
          lat: 18.0, // Approximate coordinates for St. Elizabeth
          lng: -77.8,
        },
        contacts: [
          {
            type: "email",
            value: "info@absjm.sovoli.com",
            isPublic: true,
          },
          {
            type: "phone",
            value: "+1 876 XXX-XXXX", // Placeholder - will be updated with actual contact
            label: "School",
            isPublic: true,
            primary: true,
          },
        ],
        isPrimary: true,
        features: [
          OrgLocationFeature.GATED_PREMISES,
          OrgLocationFeature.SECURE_DROPOFF,
          OrgLocationFeature.CONTROLLED_ACCESS,
          OrgLocationFeature.ONSITE_PARKING,
          OrgLocationFeature.CLEAN_BATHROOMS,
          OrgLocationFeature.CHILD_FURNITURE,
          OrgLocationFeature.DEDICATED_PLAY_AREA,
          OrgLocationFeature.DAILY_SANITIZATION,
          OrgLocationFeature.BIRTHDAY_CELEBRATIONS,
          OrgLocationFeature.FIELD_TRIPS,
        ],
      },
    ],
    socialLinks: [
      {
        platform: "website",
        url: "https://absjm.sovoli.com",
      },
    ],
  },
  websiteModule: APPLETON_BASIC_SCHOOL_WEBSITE,
  academicModule: APPLETON_BASIC_SCHOOL_ACADEMIC,
  offeringModule: APPLETON_BASIC_SCHOOL_OFFERINGS,
  workforceModule: APPLETON_BASIC_SCHOOL_WORKFORCE,
  scoringModule: null,
};
