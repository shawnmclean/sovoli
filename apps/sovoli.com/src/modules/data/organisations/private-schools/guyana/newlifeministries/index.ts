import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const NEW_LIFE_MINISTRIES_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "New Life Ministries School",
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
