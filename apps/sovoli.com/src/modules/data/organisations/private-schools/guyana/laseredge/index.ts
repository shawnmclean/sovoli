import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const LASER_EDGE_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Laser Edge Academic College",
    categories: ["private-school"],
    socialLinks: [
      {
        platform: "facebook",
        url: "https://www.facebook.com/people/Laser-Edge-Academic-College/100057705457998/",
      },
    ],
    locations: [
      {
        key: "main",
        address: {
          line1: "Lot 200 De Souza Street, Better Hope, East Coast Demerara",
          city: "Better Hope",
          countryCode: "GY",
        },
        placeId: "ChIJfSbC5Rvtr40ROAuXJUFPm4Q",
        contacts: [
          {
            type: "phone",
            value: "+592-625-3753",
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
