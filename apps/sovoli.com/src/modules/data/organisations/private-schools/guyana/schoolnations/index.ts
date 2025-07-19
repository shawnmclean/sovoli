import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const SCHOOL_NATIONS_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "School of the Nations",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: {
          line1: "41-42 New Market Street",
          line2: "Cummingsburg",
          city: "Georgetown",
          countryCode: "GY",
        },
        contacts: [
          { type: "phone", value: "+592-225-4516", isPublic: true },
          { type: "phone", value: "+592-227-4623", isPublic: true },
          { type: "phone", value: "+592-226-5781", isPublic: true },
          { type: "email", value: "info@nations.gy", isPublic: true },
        ],
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
