import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const JOSEL_EDUCATIONAL_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Jos-el Educational Institute",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: {
          line1: "120 Peter Rose Street",
          line2: "Queenstown",
          city: "Georgetown",
          countryCode: "GY",
        },
        contacts: [
          { type: "phone", value: "+592-226-7835", isPublic: true },
          { type: "email", value: "joseleducation@yahoo.com", isPublic: true },
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
