import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const FRASERS_EDUCATIONAL_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Fraser's Educational Institute",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: {
          line1: "9CR3+PMV",
          city: "fort wellington",
          countryCode: "GY",
        },
        placeId: "ChIJv6PHiVKcpY0Ridydgz_JXOI",
        contacts: [
          {
            type: "phone",
            value: "+592-232-0167",
            isPublic: true,
            primary: true,
          },
          { type: "phone", value: "+592-232-0207", isPublic: true },
          { type: "phone", value: "+592-647-9192", isPublic: true },
        ],
        isPrimary: true,
      },
    ],
    socialLinks: [
      {
        platform: "facebook",
        url: "https://www.facebook.com/Frasers-Educational-Institute-Inc-100063704855715",
      },
    ],
  },
  websiteModule: null,
  academicModule: null,
  serviceModule: null,
  workforceModule: null,
  scoringModule: null,
};
