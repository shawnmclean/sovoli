import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";
import { CREATIVE_THINKING_STATIONERY_HUB_WEBSITE } from "./website";
import { CREATIVE_THINKING_STATIONERY_HUB_WORKFORCE } from "./workforce";
import { CREATIVE_THINKING_STATIONERY_HUB_CATALOG } from "./catalog";

export const CREATIVE_THINKING_STATIONERY_HUB_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Creative Thinking Stationery Hub",
    isVerified: false,
    verification: {
      status: "pending",
      submittedBy: "system",
      submittedAt: "2025-01-27",
      incorporationDate: undefined,
      notes:
        "Verification pending - will be updated with business registration information",
      documents: [],
    },
    categories: ["stationery"],
    locations: [
      {
        key: "main-location",
        address: {
          line1: "70 Sideline Dam",
          line2: "Triumph Village",
          city: "East Coast Demerara",
          countryCode: "GY",
        },
        placeId:
          "EiBSVzJWK0o4LCBCZXRlcnZlcndhZ3RpbmcsIEd1eWFuYSImOiQKCg0J1g0EFaVAZd0QChoUChIJDeXpD7Htr40RUIFON4T4vHs",
        contacts: [
          {
            type: "whatsapp",
            value: "5927284095",
            isPublic: true,
            primary: true,
          },
        ],
        isPrimary: true,
      },
    ],
    socialLinks: [
      {
        platform: "website",
        url: "https://ctshgy.sovoli.com",
      },
    ],
  },
  websiteModule: CREATIVE_THINKING_STATIONERY_HUB_WEBSITE,
  academicModule: null,
  serviceModule: null,
  workforceModule: CREATIVE_THINKING_STATIONERY_HUB_WORKFORCE,
  scoringModule: null,
  catalogModule: CREATIVE_THINKING_STATIONERY_HUB_CATALOG,
};
