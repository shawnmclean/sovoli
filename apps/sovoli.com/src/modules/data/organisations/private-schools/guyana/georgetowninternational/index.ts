import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const GEORGETOWN_INTERNATIONAL_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Georgetown International Academy",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: { city: "georgetown", countryCode: "GY" },
        contacts: [
          { type: "phone", value: "+592-225-8347", isPublic: true },
          { type: "phone", value: "+592-226-1595", isPublic: true },
          { type: "email", value: "admissions@giagy.org", isPublic: true },
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
