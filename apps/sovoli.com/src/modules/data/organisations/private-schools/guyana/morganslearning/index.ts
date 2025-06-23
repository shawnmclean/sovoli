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
          line1: "46 Durban Street",
          line2: "Lodge",
          city: "georgetown",
          countryCode: "GY",
        },
        contacts: [
          { type: "email", value: "info@morganslearning.com", isPublic: true },
          { type: "phone", value: "+592-226-6844", isPublic: true },
          { type: "phone", value: "+592-226-6845", isPublic: true },
          { type: "phone", value: "+592-608-4745", isPublic: true },
          { type: "phone", value: "+592-608-4742", isPublic: true },
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
  offeringModule: null,
  workforceModule: null,
  scoringModule: null,
};
