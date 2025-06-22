import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const MARIAN_ACADEMY_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    logo: "/orgs/private-schools/guyana/marianacademy/logo.webp",
    name: "Marian Academy",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: {
          line1: "Carifesta Avenue, Thomas Lands",
          city: "Georgetown",
          countryCode: "GY",
        },
        contacts: [
          { type: "phone", value: "+592-226-9045", isPublic: true },
          { type: "email", value: "info@marianacademy.edu.gy", isPublic: true },
        ],
        isPrimary: true,
      },
    ],
    socialLinks: [
      {
        platform: "facebook",
        url: "https://www.facebook.com/profile.php?id=100069197352006",
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
  offeringModule: null,
  workforceModule: null,
};
