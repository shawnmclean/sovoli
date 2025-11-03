import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const SCHOOL_BRILLIANT_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "School of Brilliant Beginnings",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: {
          line1: "1662 Herstelling East Bank Demerara",
          countryCode: "GY",
        },
        placeId: "ChIJVV-p0Wbwr40RJJhQjHY7eUI",
        contacts: [],
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
