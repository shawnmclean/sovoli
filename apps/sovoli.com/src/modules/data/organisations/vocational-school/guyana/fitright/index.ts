import type { OrgInstance } from "~/modules/organisations/types";
import type { Media } from "~/modules/core/media/types";
import { ORG_USERNAME } from "./constants";
import { FITRIGHT_ACADEMY_WEBSITE } from "./website";
import { FITRIGHT_ACADEMIC } from "./academic";
import { FITRIGHT_WORKFORCE } from "./workforce";
import { FITRIGHT_ACADEMY_PHOTOS } from "./photos";

export const FITRIGHT_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "FitRight Academy",
    logoPhoto: {
      type: "image",
      url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1765638250/o/fitright/logo/logo.webp",
      assetId: "59b69ca571cbc6ac24d31aa1ddefaa28",
      publicId: "o/fitright/logo/logo",
      width: 320,
      height: 320,
      format: "webp",
      bytes: 13080,
      version: 1765638250,
    } satisfies Media,
    isVerified: true,
    verification: {
      status: "verified",
      submittedBy: "Xaverine",
      submittedAt: "2025-08-12",
      incorporationDate: "2025-07-23",
      notes: "Got confirmation from the owner.",
      documents: [
        {
          type: "business_registration",
          name: "FitRight Academy Certificate of Registration",
          uploadedAt: "2025-08-12",
          notes: "Captured by photo (in google photos)",
          url: "https://photos.app.goo.gl/t1WZjmvvpUxvuJ7d9",
          issuedDate: "2025-07-23",
          expiryDate: "2026-07-23",
          referenceNumber: "266724",
          issuingAuthority: "Office of Registrar of Business Names",
          issuingJurisdiction: {
            country: "GY",
          },
        },
      ],
    },
    categories: ["vocational-school"],
    locations: [
      {
        key: "main-location",
        address: {
          line1: "204 Charlotte Street",
          line2: "Bourda",
          city: "Georgetown",
          countryCode: "GY",
        },
        placeId: "ChIJMTbWJMjvr40RqnbyaycDRFw",
        contacts: [
          {
            type: "whatsapp",
            value: "+13862798247",
            isPublic: false,
          },
        ],
        isPrimary: true,
      },
    ],
    socialLinks: [
      {
        platform: "facebook",
        url: "https://www.facebook.com/fitrightacademy",
      },
      {
        platform: "website",
        url: "https://www.fitright.gy",
      },
    ],
    media: FITRIGHT_ACADEMY_PHOTOS,
  },
  websiteModule: FITRIGHT_ACADEMY_WEBSITE,
  academicModule: FITRIGHT_ACADEMIC,
  serviceModule: null,
  workforceModule: FITRIGHT_WORKFORCE,
  scoringModule: null,
};
