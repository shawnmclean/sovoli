import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const GREEN_ACRES_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Green Acres Primary School",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: { countryCode: "GY" },
        contacts: [],
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
