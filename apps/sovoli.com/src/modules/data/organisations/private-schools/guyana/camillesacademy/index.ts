import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const CAMILLES_ACADEMY_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Camille's Academy",

    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: { city: "diamond", countryCode: "GY" },
        contacts: [{ type: "phone", value: "+592-261-5027", isPublic: true }],
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
