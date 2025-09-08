import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const HIDDEN_TREASURES_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Hidden Treasures Academy",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: { city: "georgetown", countryCode: "GY" },
        contacts: [{ type: "phone", value: "+592-675-4379", isPublic: true }],
        isPrimary: true,
      },
    ],
  },
  websiteModule: null,
  academicModule: null,
  serviceModule: null,
  workforceModule: null,
  scoringModule: null,
};
