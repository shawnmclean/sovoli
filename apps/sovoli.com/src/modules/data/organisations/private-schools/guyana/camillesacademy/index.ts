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
        contacts: [
          { type: "phone", value: "+592-261-5027", isPublic: true },
          { type: "phone", value: "+592-265-1134", isPublic: true },
          { type: "email", value: "eibss2000@gmail.com", isPublic: true },
        ],
        isPrimary: true,
      },
      {
        key: "soesdyke",
        address: { city: "soesdyke", countryCode: "GY" },
        contacts: [],
      },
    ],
  },
  websiteModule: null,
  academicModule: null,
  serviceModule: null,
  workforceModule: null,
  scoringModule: null,
};
