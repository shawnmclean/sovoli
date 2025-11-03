import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const HIDDEN_TREASURES_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Hidden Treasures Academy",
    categories: ["private-school"],
    socialLinks: [
      {
        platform: "facebook",
        url: "https://www.facebook.com/Hiddentreasuresacademy",
      },
    ],
    locations: [
      {
        key: "main",
        address: {
          line1: "35 sandy bob and Alexander streets",
          city: "georgetown",
          countryCode: "GY",
        },
        placeId: "ChIJZ3_U8szvr40RqkaU0w37hE0",
        contacts: [
          {
            type: "phone",
            value: "+592-675-4379",
            isPublic: true,
            primary: true,
          },
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
