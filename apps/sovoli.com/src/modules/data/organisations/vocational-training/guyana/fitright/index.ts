import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";
import { FITRIGHT_ACADEMY_WEBSITE } from "./website";
import { FITRIGHT_ACADEMIC } from "./academic";

export const FITRIGHT_ORG: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Fit Right Academy",
    logo: "/orgs/vocational-training/guyana/fitright/logo.png",
    categories: ["dressmaking", "alterations", "academic-programs"],
    locations: [
      {
        key: "main-location",
        address: {
          line1: "Charlotte Street",
          city: "Georgetown",
          countryCode: "GY",
        },
        contacts: [
          {
            type: "email",
            value: "info@fitrightacademy.com",
            isPublic: true,
          },
          {
            type: "phone",
            value: "+1 (386) 279-8247",
            isPublic: false,
          },
        ],
        isPrimary: true,
      },
    ],
  },
  websiteModule: FITRIGHT_ACADEMY_WEBSITE,
  academicModule: FITRIGHT_ACADEMIC,
  offeringModule: null,
  workforceModule: null,
};
