import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const SCHOOL_NATIONS_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "School of the Nations",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: { city: "georgetown", country: "guyana" },
        contacts: [{ type: "phone", value: "+592-225-4516", isPublic: true }],
        isPrimary: true,
      },
    ],
  },
  websiteModule: null,
  academicModule: null,
  offeringModule: null,
  workforceModule: null,
};
