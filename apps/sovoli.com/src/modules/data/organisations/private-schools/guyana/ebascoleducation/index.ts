import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const EBASCOL_EDUCATION_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Ebascol Education Centre",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: { countryCode: "GY" },
        contacts: [
          { type: "phone", value: "+592-256-3176", isPublic: true },
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
