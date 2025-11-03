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
        address: {
          line1: "E Bank Public Rd",
          city: "diamond",
          countryCode: "GY",
        },
        placeId: "ChIJtY7Vti77r40R6J2cqOwiRjY",
        contacts: [
          { type: "phone", value: "+592-261-5027", isPublic: true },
          { type: "phone", value: "+592-675-1711", isPublic: true },
          { type: "email", value: "cibss2000@gmail.com", isPublic: true },
        ],
        isPrimary: true,
      },
      {
        key: "soesdyke",
        address: { city: "soesdyke", countryCode: "GY" },
        contacts: [],
      },
    ],
    socialLinks: [
      {
        platform: "facebook",
        url: "https://www.facebook.com/CamillesAcademy",
      },
    ],
  },
  websiteModule: null,
  academicModule: null,
  serviceModule: null,
  workforceModule: null,
  scoringModule: null,
};
