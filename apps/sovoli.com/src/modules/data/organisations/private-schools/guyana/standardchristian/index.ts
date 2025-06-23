import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const STANDARD_CHRISTIAN_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Standard Christian Academy",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: { city: "georgetown", countryCode: "GY" },
        contacts: [{ type: "phone", value: "+592-642-4913", isPublic: true }],
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
