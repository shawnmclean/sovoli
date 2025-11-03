import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const DHARMIC_RAMA_KRISHNA_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Dharmic Rama Krishna School",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: {
          line1: "RV9J+76J Giftland Mall",
          line2: "Liliendaal",
          countryCode: "GY",
        },
        placeId: "ChIJy5kIiTDvr40Rv2lS8yxh3ss",
        contacts: [
          {
            type: "phone",
            value: "+592-664-8789",
            isPublic: true,
            primary: true,
          },
          { type: "phone", value: "+592-226-0189", isPublic: true },
        ],
        isPrimary: true,
      },
    ],
  },
  websiteModule: null,
  academicModule: null,
  serviceModule: null,
  workforceModule: null,
  scoringModule: null,
};


