import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const TNGS_ORG_INSTANCE: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "The New Guyana School",
    claimed: false,
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: { city: "georgetown", country: "guyana" },
        contacts: [{ type: "phone", value: "+592-227-2733", isPublic: true }],
        isPrimary: true,
      },
    ],
  },
  websiteModule: null,
  academicModule: null,
  offeringModule: null,
  workforceModule: null,
};
