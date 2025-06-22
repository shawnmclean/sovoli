import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const CHASE_ACADEMY_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Chase Academy",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: {
          line1: "120-121 Parade Street",
          line2: "Kingston",
          city: "georgetown",
          countryCode: "GY",
        },
        contacts: [
          { type: "email", value: "info@chaseacademy.org.gy", isPublic: true },
          { type: "phone", value: "+592-227-0248", isPublic: true },
          {
            type: "phone",
            value: "+592-225-8482",
            label: "switchboard",
            isPublic: true,
          },
          {
            type: "phone",
            value: "+592-225-8491",
            label: "switchboard",
            isPublic: true,
          },
          {
            type: "phone",
            value: "+592-225-8452",
            label: "switchboard",
            isPublic: true,
          },
        ],
        isPrimary: true,
      },
    ],
    socialLinks: [
      { platform: "facebook", url: "https://www.facebook.com/CAF.guyana" },
      { platform: "instagram", url: "https://www.instagram.com/chase.academy" },
    ],
  },
  websiteModule: null,
  academicModule: null,
  offeringModule: null,
  workforceModule: null,
};
