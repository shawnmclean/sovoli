import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const EMMANUEL_KINDER_PREP_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Emmanuel Kinder Prep",
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        isPrimary: true,
        address: {
          line1: "26 Ward Avenue",
          city: "Mandeville",
          state: "Manchester",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1-876-317-6570",
            label: "Principal",
            isPublic: true,
            primary: true,
          },
        ],
      },
    ],
  },
  websiteModule: null,
  academicModule: null,
  serviceModule: null,
  workforceModule: null,
  scoringModule: null,
};
