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
        key: "georgetown",
        country: "guyana",
        city: "georgetown",
        address: "",
        contacts: {
          email: "info@fitrightacademy.com",
          phone: "",
        },
        isPrimary: true,
      },
    ],
  },
  websiteModule: FITRIGHT_ACADEMY_WEBSITE,
  academicModule: null,
  offeringModule: null,
};
