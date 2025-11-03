import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const CANADIAN_SCHOOL_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Canadian School of Arts & Science",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: {
          line1: "530-531 Third Avenue",
          countryCode: "GY",
        },
        placeId: "ChIJG8zzLtvxr40Rf-M_7ARM11c",
        contacts: [
          {
            type: "phone",
            value: "+592-216-6921",
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
