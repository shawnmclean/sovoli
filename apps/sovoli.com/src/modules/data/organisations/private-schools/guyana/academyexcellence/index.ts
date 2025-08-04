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
          line1: "VP6J+22V",
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
  },
  websiteModule: null,
  academicModule: null,
  offeringModule: null,
  workforceModule: null,
  scoringModule: null,
};
