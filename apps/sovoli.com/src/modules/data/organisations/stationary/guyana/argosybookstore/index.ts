import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";
import { ARGOSY_BOOK_STORE_WEBSITE } from "./website";
import { ARGOSY_BOOK_STORE_WORKFORCE } from "./workforce";
import { ARGOSY_BOOK_STORE_CATALOG } from "./catalog";

export const ARGOSY_BOOK_STORE_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Argosy Book Store",
    logo: "/images/orgs/stationary/guyana/argosybookstore/logo.webp",
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
    categories: ["stationary"],
    locations: [
      {
        key: "main-location",
        address: {
          line1: "Regent Street G/T",
          line2: "Georgetown",
          city: "Georgetown",
          countryCode: "GY",
        },
        placeId: undefined,
        contacts: [
          {
            type: "whatsapp",
            value: "5926550922",
            isPublic: true,
            primary: true,
          },
          {
            type: "email",
            value: "ganeshmohabir@hotmail.com",
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
        url: "https://argosybookstore.sovoli.com",
      },
      {
        platform: "facebook",
        url: "https://www.facebook.com/profile.php?id=100063641135458",
      },
    ],
  },
  websiteModule: ARGOSY_BOOK_STORE_WEBSITE,
  academicModule: null,
  serviceModule: null,
  workforceModule: ARGOSY_BOOK_STORE_WORKFORCE,
  scoringModule: null,
  catalogModule: ARGOSY_BOOK_STORE_CATALOG,
};
