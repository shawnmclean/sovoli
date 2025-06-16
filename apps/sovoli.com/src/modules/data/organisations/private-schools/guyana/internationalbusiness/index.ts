import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const INTERNATIONAL_BUSINESS_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "International Business College",
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
