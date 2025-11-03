import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const SCHOOL_NATIONS_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "School of the Nations",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: {
          line1: "41-42 New Market St",
          city: "Georgetown",
          countryCode: "GY",
        },
        placeId: "ChIJd608Hg3vr40RPspQbqU_Ik0",
        contacts: [
          { type: "phone", value: "+592-226-5781", isPublic: true },
          { type: "email", value: "info@nations.gy", isPublic: true },
        ],
        isPrimary: true,
      },
    ],
    socialLinks: [
      {
        platform: "facebook",
        url: "https://www.facebook.com/schoolofthenationsgy/",
      },
    ],
  },
  websiteModule: null,
  academicModule: null,
  serviceModule: null,
  workforceModule: null,
  scoringModule: null,
};
