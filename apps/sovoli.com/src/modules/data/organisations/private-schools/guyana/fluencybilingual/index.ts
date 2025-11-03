import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const FLUENCY_BILINGUAL_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Fluency Bilingual Academy",
    categories: ["private-school"],
    socialLinks: [
      {
        platform: "facebook",
        url: "https://www.facebook.com/people/Fluency-Bilingual-Academy/100066474619701/",
      },
    ],
    locations: [
      {
        key: "main",
        address: { city: "georgetown", countryCode: "GY" },
        contacts: [
          {
            type: "phone",
            value: "+592-600-6651",
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
