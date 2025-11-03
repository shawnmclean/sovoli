import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const GENESIS_EARLY_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Genesis Early Childhood Centre",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: {
          line1: "QQ7J+7XV",
          city: "LaGrange",
          countryCode: "GY",
        },
        placeId: "ChIJF_btS2n7r40RJUJiXqgLfw0",
        contacts: [
          {
            type: "phone",
            value: "+592-604-9091",
            isPublic: true,
            primary: true,
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
