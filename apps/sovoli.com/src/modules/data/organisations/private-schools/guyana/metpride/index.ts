import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const MET_PRIDE_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "M.E.T Pride Academy",
    categories: ["private-school"],
    socialLinks: [
      {
        platform: "website",
        url: "http://metpride.com/",
      },
      {
        platform: "facebook",
        url: "https://www.facebook.com/metprideacademyguyana",
      },
    ],
    locations: [
      {
        key: "main",
        address: {
          line1: "W, Freeman St",
          city: "georgetown",
          countryCode: "GY",
        },
        placeId: "ChIJuYZv3VLvr40RzkXUTs7fOfg",
        contacts: [
          {
            type: "phone",
            value: "+592-227-2013",
            isPublic: true,
            primary: true,
          },
          { type: "phone", value: "+592-699-7239", isPublic: true },
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
