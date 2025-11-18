import type { OrgInstance } from "~/modules/organisations/types";

import { ORG_USERNAME } from "./constants";
import { SANDY_BANK_INFANT_SCHOOL_NEEDS } from "./needs";
import { SANDY_BANK_INFANT_SCHOOL_PROJECTS } from "./projects";

export const SANDY_BANK_INFANT_SCHOOL_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Sandy Bank Infant School",
    categories: ["public-school", "nursery-school"],
    locations: [
      {
        key: "main-campus",
        label: "Main Campus",
        isPrimary: true,
        address: {
          line1: "Treasure Beach",
          city: "Treasure Beach",
          state: "St. Elizabeth",
          countryCode: "JM",
        },
        contacts: [
          {
            type: "phone",
            value: "+1 (876) 889-0368",
            label: "Principal Erna Black-Neil",
            isPublic: true,
            primary: true,
          },
          {
            type: "phone",
            value: "+1 876 382 4366",
            label: "Office",
            isPublic: true,
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
  needsModule: SANDY_BANK_INFANT_SCHOOL_NEEDS,
  projectsModule: SANDY_BANK_INFANT_SCHOOL_PROJECTS,
};
