import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const SVN_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Saraswati Vidya Niketan (SVN)",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: {
          city: "Cornelia Ida",
          line2: "West Coast Demerara",
          countryCode: "GY",
        },
        contacts: [
          { type: "phone", value: "+592-276-0013", isPublic: true },
          { type: "phone", value: "+592-276-0014", isPublic: true },
          { type: "email", value: "secretary@svn.edu.gy", isPublic: true },
        ],
        isPrimary: true,
      },
    ],
    socialLinks: [{ platform: "website", url: "https://svn.edu.gy" }],
  },
  websiteModule: null,
  academicModule: null,
  serviceModule: null,
  workforceModule: null,
  scoringModule: null,
};


