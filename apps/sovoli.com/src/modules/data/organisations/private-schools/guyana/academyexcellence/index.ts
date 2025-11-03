import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const ACADEMY_EXCELLENCE_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Academy of Excellence",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: {
          line1: "263 Block X",
          line2: "Cornelia Ida",
          city: "Cornelia Ida",
          countryCode: "GY",
        },
        placeId: "ChIJlSUlKWXnr40R7Q6ZUCJHwsM",
        coordinates: {
          lat: 6.8601078,
          lng: -58.2699551,
        },
        contacts: [],
        isPrimary: true,
      },
    ],
    socialLinks: [
      {
        platform: "facebook",
        url: "https://www.facebook.com/Academy-of-Excellence-833797406654539/",
      },
    ],
  },
  websiteModule: null,
  academicModule: null,
  serviceModule: null,
  workforceModule: null,
  scoringModule: null,
};
