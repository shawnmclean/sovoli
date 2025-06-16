import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const SUCCESS_ELEMENTARY_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Success Elementary School",
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
