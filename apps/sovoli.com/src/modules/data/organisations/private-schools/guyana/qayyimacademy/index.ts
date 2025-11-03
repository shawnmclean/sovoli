import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const QAYYIM_ACADEMY_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Qayyim Academy",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: {
          line1: "816 De Groot En Klyne",
          city: "Uitvlugt",
          countryCode: "GY",
        },
        placeId: "ChIJeXWvEjbhr40RCWsn8lquJN8",
        contacts: [
          {
            type: "phone",
            value: "+592-622-5121",
            isPublic: true,
            primary: true,
          },
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
