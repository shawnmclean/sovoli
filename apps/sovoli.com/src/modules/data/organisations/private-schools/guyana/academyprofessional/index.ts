import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const ACADEMY_PROFESSIONAL_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Academy of Professional Studies - APS",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: {
          line1: "21 Public Road",
          line2: "Mc Doom Village",
          city: "Georgetown",
          countryCode: "GY",
        },
        contacts: [
          { type: "phone", value: "+592-233-0616", isPublic: true },
          { type: "phone", value: "+592-680-6946", isPublic: true },
        ],
        isPrimary: true,
      },
    ],
    socialLinks: [
      {
        platform: "facebook",
        url: "https://www.facebook.com/pages/Academy-of-Professional-Studies/108375192530485",
      },
    ],
  },
  websiteModule: null,
  academicModule: null,
  serviceModule: null,
  workforceModule: null,
  scoringModule: null,
};
