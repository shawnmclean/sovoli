import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const GEORGETOWN_SDA_ACADEMY_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Georgetown Seventh-day Adventist Academy",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: {
          line1: "Guyana supply, lot 12 Brikery EBD",
          city: "Georgetown",
          countryCode: "GY",
        },
        placeId: "ChIJm-5grQbvr40Rq_7pvFw9nhw",
        contacts: [
          { type: "email", value: "info@guyanaconference.org", isPublic: true },
        ],
        isPrimary: true,
      },
    ],
    socialLinks: [
      {
        platform: "facebook",
        url: "https://www.facebook.com/GeorgetownSDAAcademy",
      },
    ],
  },
  websiteModule: null,
  academicModule: null,
  serviceModule: null,
  workforceModule: null,
  scoringModule: null,
};
