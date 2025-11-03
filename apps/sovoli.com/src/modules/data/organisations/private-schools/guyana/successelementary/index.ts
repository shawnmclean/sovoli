import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const SUCCESS_ELEMENTARY_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Success Elementary School",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: {
          line1: "QR69+8VW",
          city: "Georgetown",
          countryCode: "GY",
        },
        placeId: "ChIJPQW3sHTxr40RfEKrInJ4UMM",
        contacts: [],
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
