import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const GEORGETOWN_LEARNING_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Georgetown International Learning Centre - Playgroup and Nursery",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: { countryCode: "GY" },
        contacts: [{ type: "phone", value: "+592-226-0396", isPublic: true }],
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
