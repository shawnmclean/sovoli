import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const ACADEMY_PROFESSIONAL_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Academy of Professional Studies - APS",
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
