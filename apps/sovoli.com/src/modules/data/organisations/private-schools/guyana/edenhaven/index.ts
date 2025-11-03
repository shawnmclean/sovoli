import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const EDEN_HAVEN_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Eden Haven Academy",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: {
          line1: "RW99+4M8",
          line2: "Success",
          countryCode: "GY",
        },
        placeId: "ChIJnTIFkKvtr40RUWhAxXoTScw",
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
