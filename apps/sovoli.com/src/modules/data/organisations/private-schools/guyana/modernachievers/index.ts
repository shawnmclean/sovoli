import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const MODERN_ACHIEVERS_ACADEMY_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Modern Achievers Academy",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: {
          line1: "279 Forshaw Street",
          city: "Georgetown",
          countryCode: "GY",
        },
        contacts: [
          { type: "phone", value: "+592-687-5462", isPublic: true, primary: true },
          { type: "email", value: "Tameka_crumewing@yahoo.com", isPublic: true },
        ],
        isPrimary: true,
      },
    ],
    socialLinks: [
      {
        platform: "facebook",
        url: "https://www.facebook.com/profile.php?id=100063555550095",
      },
    ],
  },
  websiteModule: null,
  academicModule: null,
  serviceModule: null,
  workforceModule: null,
  scoringModule: null,
};

