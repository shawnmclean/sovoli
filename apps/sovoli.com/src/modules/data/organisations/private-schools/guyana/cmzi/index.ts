import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const CMZI_ORG_INSTANCE: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "CIOG-Meten Meer Zorg Islamic Academy",
    claimed: false,
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: { country: "guyana" },
        contacts: [{ type: "phone", value: "+592-689-5420", isPublic: true }],
        isPrimary: true,
      },
    ],
  },
  websiteModule: null,
  academicModule: null,
  offeringModule: null,
  workforceModule: null,
};
