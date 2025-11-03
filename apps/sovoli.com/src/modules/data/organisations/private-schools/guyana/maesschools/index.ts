import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const MAES_SCHOOLS_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Mae's Schools",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: {
          line1: "RVF8+863",
          city: "Georgetown",
          countryCode: "GY",
        },
        placeId: "ChIJ49aKHU_vr40R6MEyo06BeeI",
        contacts: [
          { type: "phone", value: "+592-227-8772", isPublic: true },
          { type: "email", value: "info@maesschools.edu.gy", isPublic: true },
        ],
        isPrimary: true,
      },
    ],
    socialLinks: [
      {
        platform: "facebook",
        url: "https://www.facebook.com/maesschools/",
      },
    ],
  },
  websiteModule: null,
  academicModule: null,
  serviceModule: null,
  workforceModule: null,
  scoringModule: null,
};
