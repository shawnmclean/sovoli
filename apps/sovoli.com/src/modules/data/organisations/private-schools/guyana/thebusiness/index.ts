import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const THE_BUSINESS_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "The Business School",
    categories: ["private-school"],
    socialLinks: [
      {
        platform: "website",
        url: "http://www.busineschool.com/",
      },
    ],
    locations: [
      {
        key: "main",
        address: {
          line1: "43 Brickdam St",
          city: "Georgetown",
          countryCode: "GY",
        },
        placeId: "ChIJ61Y4SqHvr40RiWUqL8P7Sss",
        contacts: [
          {
            type: "phone",
            value: "+592-226-8906",
            isPublic: true,
            primary: true,
          },
          { type: "email", value: "info@busineschool.com", isPublic: true },
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
