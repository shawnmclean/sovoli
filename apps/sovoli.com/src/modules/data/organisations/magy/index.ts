import type { OrgInstance } from "~/modules/organisations/types";
import { MODERN_ACADEMY_ACADEMIC } from "./academic";
import { ORG_USERNAME } from "./constants";
import { MODERN_ACADEMY_OFFERINGS } from "./offering";
import { MODERN_ACADEMY_WORKFORCE } from "./workforce";
import { MODERN_ACADEMY_WEBSITE } from "./website";

export const MAGY_ORG_INSTANCE: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Modern Academy",
    logo: "/orgs/magy/logo.png",
    claimed: true,
    categories: ["private-school", "nursery-school"],
    locations: [
      {
        key: "main-campus",
        address: {
          line1: "Lot 11, Public Road, Mon Repos",
          city: "Georgetown",
          country: "Guyana",
        },
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
          { type: "phone", value: "+592-627-1915", isPublic: false },
          {
            type: "whatsapp",
            value: "+592 627-1915",
            label: "Joel",
            isPublic: true,
          },
        ],
        isPrimary: true,
      },
    ],
    socialLinks: [
      {
        platform: "facebook",
        url: "https://www.facebook.com/profile.php?id=100063128446623",
      },
    ],
  },
  websiteModule: MODERN_ACADEMY_WEBSITE,
  academicModule: MODERN_ACADEMY_ACADEMIC,
  offeringModule: MODERN_ACADEMY_OFFERINGS,
  workforceModule: MODERN_ACADEMY_WORKFORCE,
};
