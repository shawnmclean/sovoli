import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const JOSEL_EDUCATIONAL_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Jos-el Educational Institute",
    categories: ["private-school"],
    socialLinks: [
      {
        platform: "website",
        url: "https://joselacademy.org/",
      },
    ],
    locations: [
      {
        key: "main",
        address: {
          line1: "Laluni & Peter Rose Streets",
          line2: "120 Laluni St",
          city: "Georgetown",
          countryCode: "GY",
        },
        placeId: "ChIJPTqxFAHvr40RSJXY-yShXQ0",
        contacts: [
          {
            type: "phone",
            value: "+592-226-7868",
            isPublic: true,
            primary: true,
          },
          { type: "phone", value: "+592-226-7835", isPublic: true },
          { type: "email", value: "joseleducation@yahoo.com", isPublic: true },
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
