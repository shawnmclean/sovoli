import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const JOSEL_EDUCATIONAL_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Jos-el Educational Institute",
    claimed: false,
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: {
          line1: "120 Laluni and Peter Rose Street",
          line2: "Queenstown",
          city: "georgetown",
          country: "guyana",
        },
        contacts: [{ type: "phone", value: "+592-226-7868", isPublic: true }],
        isPrimary: true,
      },
    ],
  },
  websiteModule: null,
  academicModule: null,
  offeringModule: null,
  workforceModule: null,
};
