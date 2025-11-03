import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const VALMIKI_VIDYALAYA_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Valmiki Vidyalaya",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: {
          line1: "QXW6+H8X",
          city: "Lusignan",
          countryCode: "GY",
        },
        placeId: "ChIJM3CqCuvtr40RQXkR_s5Rt_c",
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
