import type { OrgInstance } from "~/modules/organisations/types";
import type { Media } from "~/modules/core/media/types";
import { ORG_USERNAME } from "./constants";
import { PHILS_HARDWARE_CATALOG } from "./catalog";

const PHILS_HARDWARE_PHOTOS: Media[] = [
  {
    type: "image",
    url: "https://res.cloudinary.com/dipyku9mn/image/upload/v1761156821/o/philshardware/org/1.png",
    assetId: "placeholder-asset-id",
    publicId: "o/philshardware/org/1",
    width: 1536,
    height: 1024,
    format: "png",
    bytes: 2569410,
    version: 1761156821,
  },
];

export const PHILS_HARDWARE_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Phil's Hardware",
    isVerified: false,
    verification: {
      status: "pending",
      submittedBy: "system",
      submittedAt: "2025-11-22",
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
          line1: "123 Spanish Town Road",
          line2: "Kingston 11",
          city: "Kingston",
          countryCode: "JM",
        },
        placeId: undefined,
        contacts: [
          {
            type: "phone",
            value: "+1876555PHIL",
            isPublic: true,
            primary: true,
          },
          {
            type: "email",
            value: "info@philshardware.com",
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
        url: "https://philshardwarejm.sovoli.com",
      },
    ],
    media: PHILS_HARDWARE_PHOTOS,
  },
  websiteModule: null,
  academicModule: null,
  serviceModule: null,
  workforceModule: null,
  scoringModule: null,
  catalogModule: PHILS_HARDWARE_CATALOG,
};
