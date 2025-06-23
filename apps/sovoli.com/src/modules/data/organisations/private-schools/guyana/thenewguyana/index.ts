import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const THE_NEW_GUYANA_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "The New Guyana School",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: { city: "georgetown", countryCode: "GY" },
        contacts: [{ type: "phone", value: "+592-227-2733", isPublic: true }],
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
