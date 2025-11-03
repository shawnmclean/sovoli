import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const LASER_EDGE_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Laser Edge Academic College",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: {
          line1: "Lot 200 De Souza Street",
          line2: "Better Hope, East Coast Demerara Better Hope",
          countryCode: "GY",
        },
        placeId: "ChIJfSbC5Rvtr40ROAuXJUFPm4Q",
        contacts: [
          { type: "phone", value: "+592-625-3753", isPublic: true },
        ],
        isPrimary: true,
      },
    ],
    socialLinks: [
      {
        platform: "facebook",
        url: "https://www.facebook.com/people/Laser-Edge-Academic-College/100057705457998/",
      },
    ],
  },
  websiteModule: null,
  academicModule: null,
  serviceModule: null,
  workforceModule: null,
  scoringModule: null,
};
