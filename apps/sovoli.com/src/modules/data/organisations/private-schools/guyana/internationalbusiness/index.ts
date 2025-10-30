import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const INTERNATIONAL_BUSINESS_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "International Business College",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: { countryCode: "GY" },
        contacts: [
          { type: "phone", value: "+592-225-5474", isPublic: true },
          { type: "email", value: "ibusinesscollege@yahoo.com", isPublic: true },
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
