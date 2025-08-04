import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const APEX_EDUCATION_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Apex Education",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: {
          line1: "RW95+QW4",
          city: "Georgetown",
          countryCode: "GY",
        },
        placeId: "ChIJRSkgg7rtr40RkOmXRc1sNBk",
        coordinates: {
          lat: 6.8203095,
          lng: -58.0895078,
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
