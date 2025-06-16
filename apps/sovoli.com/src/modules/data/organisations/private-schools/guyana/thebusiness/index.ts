import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const THE_BUSINESS_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "The Business School",
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
