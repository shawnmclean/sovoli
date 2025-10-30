import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const THE_GUYANA_EDUCATION_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "The Guyana Education Trust College",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: { countryCode: "GY" },
        contacts: [
          { type: "phone", value: "+592-225-5279", isPublic: true },
          { type: "phone", value: "+592-226-9717", isPublic: true },
          { type: "email", value: "getc@solutions2000.net", isPublic: true },
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
