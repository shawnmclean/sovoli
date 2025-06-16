import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const GENESIS_EARLY_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Genesis Early Childhood Centre",
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
