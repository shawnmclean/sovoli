import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const HEAVENLY_SUNLIGHT_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Heavenly Sunlight Day Care & Pre School",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: {
          line1: "29 Durban & Creen Streets",
          line2: "Newburg",
          city: "Georgetown",
          countryCode: "GY",
        },
        contacts: [
          { type: "phone", value: "+592-610-6118", isPublic: true },
          { type: "phone", value: "+592-226-7751", isPublic: true },
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
