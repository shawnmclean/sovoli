import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const THE_NEW_GUYANA_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "The New Guyana School",
    categories: ["private-school"],
    socialLinks: [
      {
        platform: "website",
        url: "https://newguyanaschool.edu.gy",
      },
      {
        platform: "facebook",
        url: "https://www.facebook.com/newguyanaschool",
      },
    ],
    locations: [
      {
        key: "main",
        address: {
          line1: "Lot 1, Houston Gardens (behind)",
          line2: "Greater Georgetown",
          city: "Georgetown",
          countryCode: "GY",
        },
        placeId: "ChIJATLWtdrvr40RHEllyelP5NU",
        contacts: [
          {
            type: "phone",
            value: "+592-225-2135",
            isPublic: true,
            primary: true,
          },
          { type: "phone", value: "+592-225-1807", isPublic: true },
          {
            type: "email",
            value: "admin@newguyanaschool.edu.gy",
            isPublic: true,
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
