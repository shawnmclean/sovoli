import type { OrgInstance } from "~/modules/organisations/types";
import { OrgLocationFeature } from "~/modules/organisations/types";
import { BACCHUS_LEARNING_ACADEMIC } from "./academic";
import { ORG_USERNAME } from "./constants";
import { BACCHUS_LEARNING_OFFERINGS } from "./offering";
import { BACCHUS_LEARNING_WORKFORCE } from "./workforce";
import { BACCHUS_LEARNING_WEBSITE } from "./website";
import { BACCHUS_LEARNING_EVENTS } from "./events";
import { BACCHUS_LEARNING_PHOTOS } from "./photos";

export const BACCHUS_LEARNING_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Bacchus Learning Centre",
    logo: "https://res.cloudinary.com/dipyku9mn/image/upload/v1761265485/o/blcgy/school/park.jpg",
    isVerified: false,
    verification: {
      status: "pending",
      submittedBy: "",
      submittedAt: "",
      incorporationDate: "",
      notes: "Verification pending - no documents submitted yet",
      documents: [],
    },
    internalCRM: {
      claimStatus: "unclaimed",
      claimedBy: "",
      claimedAt: "",
      people: [],
    },
    categories: ["private-school", "nursery-school", "primary-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        address: {
          line1: "75 Pike Street",
          city: "Campbellville",
          countryCode: "GY",
          landmark: "Georgetown",
        },
        coordinates: {
          lat: 6.8045, // Approximate coordinates for Campbellville
          lng: -58.1553,
        },
        contacts: [
          {
            type: "email",
            value: "amarbacchus@live.com",
            isPublic: true,
          },
          {
            type: "phone",
            value: "+592 681-0037",
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
        platform: "facebook",
        url: "https://www.facebook.com/profile.php?id=100066985290933",
      },
    ],
    supplierRecommendations: [],
    photos: BACCHUS_LEARNING_PHOTOS,
  },
  websiteModule: BACCHUS_LEARNING_WEBSITE,
  academicModule: BACCHUS_LEARNING_ACADEMIC,
  serviceModule: BACCHUS_LEARNING_OFFERINGS,
  workforceModule: BACCHUS_LEARNING_WORKFORCE,
  scoringModule: null,
  eventModule: BACCHUS_LEARNING_EVENTS,
};
