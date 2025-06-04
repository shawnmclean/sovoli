import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";
import { FITRIGHT_ACADEMY_WEBSITE } from "./website";

export const FITRIGHT_ORG_INSTANCE: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Fit Right Academy",
    logo: "/orgs/fitright/logo.png",
    claimed: true,
    categories: ["dressmaking", "alterations", "academic-programs"],
    locations: [
      {
        key: "main-location",
        address: {
          line1: "Lot 11, Public Road, Mon Repos",
          city: "Georgetown",
          country: "Guyana",
        },
        contacts: [
          {
            type: "email",
            value: "info@fitrightacademy.com",
          },
          {
            type: "phone",
            value: "+592-627-1915",
          },
        ],
        isPrimary: true,
      },
    ],
  },
  websiteModule: FITRIGHT_ACADEMY_WEBSITE,
  academicModule: null,
  offeringModule: null,
};
