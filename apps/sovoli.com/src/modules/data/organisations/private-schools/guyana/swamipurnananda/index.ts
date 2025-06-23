import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const SWAMI_PURNANANDA_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Swami Purnananda Primary School",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: {
          line1: "Ashram Compound",
          line2: "Cove and John",
          city: "cove and john",
          countryCode: "GY",
        },
        coordinates: { lat: 6.80579, lng: -58.16071 },
        contacts: [
          { type: "email", value: "pr@moe.gov.gy", isPublic: true },
          { type: "phone", value: "+592-223-7900", isPublic: true },
        ],
        isPrimary: true,
      },
    ],
    socialLinks: [
      {
        platform: "facebook",
        url: "https://www.facebook.com/Swami-Purnananda-Primary-School-100057524885993",
      },
    ],
  },
  websiteModule: null,
  academicModule: null,
  offeringModule: null,
  workforceModule: null,
  scoringModule: null,
};
