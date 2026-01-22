import type { Media } from "~/modules/core/media/types";
import type { OrgInstance } from "~/modules/organisations/types";
import { ARGOSY_BOOK_STORE_CATALOG } from "./catalog";
import { ORG_USERNAME } from "./constants";
import { ARGOSY_BOOK_STORE_WEBSITE } from "./website";
import { ARGOSY_BOOK_STORE_WORKFORCE } from "./workforce";

const ARGOSY_BOOK_STORE_PHOTOS: Media[] = [
  {
    type: "image",
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
    logoPhoto: {
      type: "image",
      url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1765638257/o/argosybookstore/logo/logo.webp",
      assetId: "cc2a0b0a8399911a8e5d7359a30502fe",
      publicId: "o/argosybookstore/logo/logo",
      width: 320,
      height: 320,
      format: "webp",
      bytes: 4212,
      version: 1765638257,
    } satisfies Media,
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
    media: ARGOSY_BOOK_STORE_PHOTOS,
  },
  websiteModule: ARGOSY_BOOK_STORE_WEBSITE,
  academicModule: null,
  serviceModule: null,
  workforceModule: ARGOSY_BOOK_STORE_WORKFORCE,
  scoringModule: null,
  catalogModule: ARGOSY_BOOK_STORE_CATALOG,
};
