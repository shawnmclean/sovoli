import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const FLUENCY_BILINGUAL_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Fluency Bilingual Academy",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: { city: "georgetown", country: "guyana" },
        contacts: [{ type: "phone", value: "+592-600-6651", isPublic: true }],
        isPrimary: true,
      },
    ],
  },
  websiteModule: null,
  academicModule: null,
  offeringModule: null,
  workforceModule: null,
};
