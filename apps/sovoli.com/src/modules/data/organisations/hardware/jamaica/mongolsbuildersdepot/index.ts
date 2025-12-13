import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";
import { MONGOLS_BUILDERS_DEPOT_WEBSITE } from "./website";
import { MONGOLS_BUILDERS_DEPOT_WORKFORCE } from "./workforce";
import { MONGOLS_BUILDERS_DEPOT_CATALOG } from "./catalog";
import { MONGOLS_BUILDERS_DEPOT_PHOTOS } from "./photos";

export const MONGOLS_BUILDERS_DEPOT_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Mongol's Builders Depot",
    isVerified: false,
    verification: {
      status: "pending",
      submittedBy: "system",
      submittedAt: "2025-11-25",
      incorporationDate: undefined,
      notes:
        "Verification pending - will be updated with business registration information",
      documents: [],
    },
    categories: ["hardware"],
    locations: [
      {
        key: "main-location",
        address: {
          line1: "12 King Street",
          line2: "Linstead P.O.",
          city: "Linstead",
          countryCode: "JM",
        },
        placeId: undefined,
        contacts: [
          {
            type: "phone",
            value: "876-543-5469",
            isPublic: true,
            primary: true,
          },
          {
            type: "phone",
            value: "876-885-2433",
            isPublic: true,
            primary: false,
          },
        ],
        isPrimary: true,
      },
    ],
    socialLinks: [
      {
        platform: "website",
        url: "https://mongolsbuildersdepotjm.sovoli.com",
      },
    ],
    media: MONGOLS_BUILDERS_DEPOT_PHOTOS,
  },
  websiteModule: MONGOLS_BUILDERS_DEPOT_WEBSITE,
  academicModule: null,
  serviceModule: null,
  workforceModule: MONGOLS_BUILDERS_DEPOT_WORKFORCE,
  scoringModule: null,
  catalogModule: MONGOLS_BUILDERS_DEPOT_CATALOG,
};

