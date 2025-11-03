import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const MORGANS_LEARNING_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Morgan's Learning Centre",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: {
          line1: "46 Durban St",
          city: "Georgetown",
          countryCode: "GY",
        },
        placeId: "ChIJy8rS3u3vr40R1xLDRRc3zrc",
        contacts: [
          { type: "email", value: "info@morganslearning.com", isPublic: true },
          { type: "phone", value: "+592-226-6844", isPublic: true },
        ],
        isPrimary: true,
      },
    ],
    socialLinks: [
      {
        platform: "facebook",
        url: "https://www.facebook.com/morganlearningcentre",
      },
      {
        platform: "instagram",
        url: "https://www.instagram.com/morganslearningcentre",
      },
      { platform: "website", url: "https://morganslearning.com" },
    ],
  },
  websiteModule: null,
  academicModule: null,
  serviceModule: null,
  workforceModule: null,
  scoringModule: null,
};
