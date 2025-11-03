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
          line1: "Block H, North Public Road",
          city: "Cornelia Ida",
          line2: "West Coast Demerara",
          countryCode: "GY",
        },
        placeId: "ChIJyWrFV6Xmr40R7awQEIthRb8",
        contacts: [
          {
            type: "phone",
            value: "+592-276-0013",
            isPublic: true,
            primary: true,
          },
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


