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
        address: { country: "guyana" },
        contacts: [],
        isPrimary: true,
      },
    ],
  },
  websiteModule: null,
  academicModule: null,
  offeringModule: null,
  workforceModule: null,
};
