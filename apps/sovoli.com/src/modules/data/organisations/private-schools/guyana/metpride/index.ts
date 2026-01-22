import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const MET_PRIDE_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "M.E.T Pride Academy",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: {
          line1: "W, Freeman St",
          city: "georgetown",
          countryCode: "GY",
        },
        placeId: "ChIJuYZv3VLvr40RzkXUTs7fOfg",
        contacts: [{ type: "phone", value: "+592-227-2013", isPublic: true }],
        isPrimary: true,
      },
    ],
    socialLinks: [
      {
        platform: "facebook",
        url: "https://www.facebook.com/metprideacademyguyana",
      },
    ],
  },
  websiteModule: null,
  academicModule: null,
  serviceModule: null,
  workforceModule: null,
  scoringModule: null,
};
