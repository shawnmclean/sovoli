import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const MONAR_EDUCATIONAL_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Monar Educational Institute",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: { countryCode: "GY" },
        contacts: [{ type: "phone", value: "+592-223-7226", isPublic: true }],
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
