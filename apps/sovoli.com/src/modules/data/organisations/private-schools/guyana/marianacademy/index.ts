import type { OrgInstance } from "~/modules/organisations/types";
import type { Media } from "~/modules/core/media/types";
import { ORG_USERNAME } from "./constants";

export const MARIAN_ACADEMY_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    logoPhoto: {
      type: "image",
      url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1765638258/o/marianacademy/logo/logo.webp",
      assetId: "0085d409a8b9e3d27bf52cb08446d7e8",
      publicId: "o/marianacademy/logo/logo",
      width: 200,
      height: 200,
      format: "webp",
      bytes: 5354,
      version: 1765638258,
    } satisfies Media,
    name: "Marian Academy",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: {
          line1: "Marian Academy, Carifesta Ave",
          city: "Georgetown",
          countryCode: "GY",
        },
        placeId: "ChIJ56xGfhDvr40Rm2ZnIABICMw",
        coordinates: {
          lat: 6.8221625,
          lng: -58.1553697,
        },
        contacts: [
          { type: "phone", value: "+592-226-9044", isPublic: true },
          { type: "email", value: "info@marianacademy.edu.gy", isPublic: true },
        ],
        isPrimary: true,
      },
    ],
    socialLinks: [
      {
        platform: "facebook",
        url: "https://www.facebook.com/people/Marian-Academy/100066278006703/",
      },
      {
        platform: "instagram",
        url: "https://www.instagram.com/marian_academy_gy",
      },
      { platform: "website", url: "https://marianacademy.edu.gy" },
    ],
  },
  websiteModule: null,
  academicModule: null,
  serviceModule: null,
  workforceModule: null,
  scoringModule: null,
};
