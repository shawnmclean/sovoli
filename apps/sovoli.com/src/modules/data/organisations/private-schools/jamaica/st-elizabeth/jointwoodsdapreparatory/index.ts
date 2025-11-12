import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";

export const JOINTWOOD_S_D_A_PREPARATORY_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Jointwood S.D.A Preparatory",
    categories: ["private-school", "nursery-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "Jointwood",
          city: "Elderslie P.O.",
          state: "St. Elizabeth",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1-876-897-9133",
            label: "Office",
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
