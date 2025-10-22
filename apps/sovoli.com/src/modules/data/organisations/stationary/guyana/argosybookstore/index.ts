import type { OrgInstance } from "~/modules/organisations/types";
import type { Photo } from "~/modules/core/photos/types";
import { ORG_USERNAME } from "./constants";
import { ARGOSY_BOOK_STORE_WEBSITE } from "./website";
import { ARGOSY_BOOK_STORE_WORKFORCE } from "./workforce";
import { ARGOSY_BOOK_STORE_CATALOG } from "./catalog";

const ARGOSY_BOOK_STORE_PHOTOS: Photo[] = [
  {
    category: "default",
    url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1761156821/o/argosy/org/o/argosy/org/1.png",
    assetId: "f1ea46a8a2cc2d34f756b6c3ffefd681",
    publicId: "o/argosy/org/o/argosy/org/1",
    width: 1536,
    height: 1024,
    format: "png",
    bytes: 2569410,
    version: 1761156821,
  },
];

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
    photos: ARGOSY_BOOK_STORE_PHOTOS,
  },
  websiteModule: ARGOSY_BOOK_STORE_WEBSITE,
  academicModule: null,
  serviceModule: null,
  workforceModule: ARGOSY_BOOK_STORE_WORKFORCE,
  scoringModule: null,
  catalogModule: ARGOSY_BOOK_STORE_CATALOG,
};
