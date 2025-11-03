import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const MAES_SCHOOLS_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Mae's Schools",
    categories: ["private-school"],
    socialLinks: [
      {
        platform: "website",
        url: "https://maesschools.edu.gy",
      },
    ],
    locations: [
      {
        key: "main",
        address: {
          line1: "9 & 19 Third Avenue",
          line2: "Subryanville",
          city: "Georgetown",
          countryCode: "GY",
        },
        placeId: "ChIJ49aKHU_vr40R6MEyo06BeeI",
        contacts: [
          {
            type: "phone",
            value: "+592-227-8772",
            isPublic: true,
            primary: true,
          },
          { type: "phone", value: "+592-226-2660", isPublic: true },
          { type: "phone", value: "+592-227-4339", isPublic: true },
          { type: "phone", value: "+592-225-9812", isPublic: true },
          { type: "email", value: "info@maesschools.edu.gy", isPublic: true },
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
