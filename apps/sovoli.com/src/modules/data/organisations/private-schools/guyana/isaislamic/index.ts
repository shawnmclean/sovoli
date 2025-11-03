import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const ISA_ISLAMIC_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "ISA Islamic School",
    categories: ["private-school"],
    socialLinks: [
      {
        platform: "website",
        url: "http://www.isaislamicschool.com/",
      },
    ],
    locations: [
      {
        key: "main",
        address: {
          line1: "305-307 East Street",
          line2: "South Cummingsburg",
          city: "Georgetown",
          countryCode: "GY",
        },
        placeId: "ChIJiRKZieXvr40ReB1kBvqBa0A",
        contacts: [
          {
            type: "phone",
            value: "+592-226-0973",
            isPublic: true,
            primary: true,
          },
          { type: "phone", value: "+592-226-3952", isPublic: true },
          { type: "phone", value: "+592-223-6402", isPublic: true },
          {
            type: "email",
            value: "isaislamicschool@gmail.com",
            isPublic: true,
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
