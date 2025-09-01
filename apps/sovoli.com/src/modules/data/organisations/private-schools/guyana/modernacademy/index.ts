import type { OrgInstance } from "~/modules/organisations/types";
import { OrgLocationFeature } from "~/modules/organisations/types";
import { MODERN_ACADEMY_ACADEMIC } from "./academic";
import { ORG_USERNAME } from "./constants";
import { MODERN_ACADEMY_OFFERINGS } from "./offering";
import { MODERN_ACADEMY_WORKFORCE } from "./workforce";
import { MODERN_ACADEMY_WEBSITE } from "./website";

export const MODERN_ACADEMY_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Modern Academy",
    logo: "/orgs/magy/logo.webp",
    isVerified: true,
    verification: {
      status: "verified",
      submittedBy: "Nessa",
      submittedAt: "2025-05-24",
      incorporationDate: "2020-02-28",
      notes: "Went to location and saw the original registration.",
      documents: [
        {
          type: "business_registration",
          name: "Modern Academy Certificate of Registration 2020",
          uploadedAt: "2025-05-24",
          notes: "Captured by photo (in google photos)",
          url: "https://photos.app.goo.gl/LBvL5xQ2gT4ssU3Y8",
          issuedDate: "2020-02-28",
          expiryDate: "2021-02-25",
          referenceNumber: "178271",
          issuingAuthority: "Office of Registrar of Business Names",
          issuingJurisdiction: {
            country: "GY",
          },
        },
        {
          type: "business_registration",
          name: "Modern Academy Certificate of Registration 2025",
          uploadedAt: "2025-08-15",
          notes: "Captured by photo (in google photos)",
          url: "https://photos.app.goo.gl/k6jKS9i5Arz5QvQFA",
          issuedDate: "2025-07-03",
          expiryDate: "2026-07-03",
          referenceNumber: "265489",
          issuingAuthority: "Office of Registrar of Business Names",
          issuingJurisdiction: {
            country: "GY",
          },
        },
      ],
    },
    internalCRM: {
      claimStatus: "claimed",
      claimedBy: "Joel",
      claimedAt: "2025-05-20",
      people: [
        {
          name: "Joel",
          contacts: [
            {
              type: "whatsapp",
              value: "+592 627-1915",
              label: "Joel",
              isPublic: true,
            },
          ],
        },
      ],
    },
    categories: ["private-school", "nursery-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        address: {
          line1: "Lot 11, Public Road",
          city: "Mon Repos",
          countryCode: "GY",
          landmark: "Opposite GBTI Bank",
        },
        placeId: "ChIJKbqkI_ftr40RoBB0_9AsWAo",
        coordinates: {
          lat: 6.807574377222727,
          lng: -58.053166525904416,
        },
        contacts: [
          {
            type: "email",
            value: "info@ma.edu.gy",
            isPublic: true,
          },
          {
            type: "whatsapp",
            value: "+592 749-2019",
            label: "School",
            isPublic: true,
            primary: true,
          },
          {
            type: "whatsapp",
            value: "+592 627-1915",
            label: "Joel",
            isPublic: true,
          },
          {
            type: "whatsapp",
            value: "+592 751-3788",
            label: "Nessa",
            isPublic: true,
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
      // {
      //   key: "secondary-campus",
      //   address: {
      //     line1: "Lot 11, Public Road, Mon Repos",
      //     city: "Georgetown",
      //     countryCode: "GY",
      //   },
      //   contacts: [
      //     {
      //       type: "email",
      //       value: "info@ma.edu.gy",
      //       isPublic: true,
      //     },
      //   ],
      // },
    ],
    socialLinks: [
      {
        platform: "facebook",
        url: "https://www.facebook.com/profile.php?id=100063128446623",
      },
      {
        platform: "website",
        url: "https://www.ma.edu.gy",
      },
    ],
  },
  websiteModule: MODERN_ACADEMY_WEBSITE,
  academicModule: MODERN_ACADEMY_ACADEMIC,
  offeringModule: MODERN_ACADEMY_OFFERINGS,
  workforceModule: MODERN_ACADEMY_WORKFORCE,
  scoringModule: null,
};
