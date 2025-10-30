import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const ANAIS_PRIVATE_SCHOOL_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Anais Private School",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: {
          line1: "149 Crown Street",
          line2: "Queenstown",
          city: "Georgetown",
          countryCode: "GY",
        },
        contacts: [{ type: "phone", value: "+592-227-7757", isPublic: true }],
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


