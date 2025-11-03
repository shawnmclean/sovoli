import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const LOVABLE_FRIENDS_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Lovable Friends Academy",
    categories: ["private-school"],
    socialLinks: [
      {
        platform: "facebook",
        url: "https://www.facebook.com/people/Lovable-Friends-Academy/100070935283966/",
      },
    ],
    locations: [
      {
        key: "main",
        address: { city: "georgetown", countryCode: "GY" },
        contacts: [
          {
            type: "phone",
            value: "+592-663-0397",
            isPublic: true,
            primary: true,
          },
        ],
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
