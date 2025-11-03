import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const THE_GUYANA_EDUCATION_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "The Guyana Education Trust College",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: {
          line1: "Doctor Harrycharran Building",
          line2: "91 Middle St",
          city: "Georgetown",
          countryCode: "GY",
        },
        placeId: "ChIJJzDKcQzvr40RtimJJppsxPA",
        contacts: [
          { type: "phone", value: "+592-225-5279", isPublic: true },
          { type: "email", value: "getc@solutions2000.net", isPublic: true },
        ],
        isPrimary: true,
      },
    ],
    socialLinks: [
      {
        platform: "facebook",
        url: "https://www.facebook.com/getc1999/",
      },
    ],
  },
  websiteModule: null,
  academicModule: null,
  serviceModule: null,
  workforceModule: null,
  scoringModule: null,
};
