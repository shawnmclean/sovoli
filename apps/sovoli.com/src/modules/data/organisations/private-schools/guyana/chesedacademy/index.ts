import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const CHESED_ACADEMY_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Chesed Academy",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: { city: "georgetown", country: "guyana" },
        contacts: [{ type: "phone", value: "+592-650-7584", isPublic: true }],
        isPrimary: true,
      },
    ],
  },
  websiteModule: null,
  academicModule: null,
  offeringModule: null,
  workforceModule: null,
};
