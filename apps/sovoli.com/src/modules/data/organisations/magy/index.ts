import type { OrgInstance } from "~/modules/organisations/types";
import { MODERN_ACADEMY_ACADEMIC } from "./academic";
import { ORG_USERNAME } from "./constants";
import { MODERN_ACADEMY_OFFERINGS } from "./offering";
import { MODERN_ACADEMY_WEBSITE } from "./website";

export const MAGY_ORG_INSTANCE: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Modern Academy",
    logo: "/orgs/magy/logo.png",
    claimed: true,
    categories: ["private-school", "nursery-school"],
    locations: [
      {
        key: "georgetown",
        country: "guyana",
        city: "georgetown",
        address: "123 Regent Street",
        contacts: {
          email: "info@ma.edu.gy",
          phone: "+592-123-4567",
        },
        isPrimary: true,
      },
    ],
  },
  websiteModule: MODERN_ACADEMY_WEBSITE,
  academicModule: MODERN_ACADEMY_ACADEMIC,
  offeringModule: MODERN_ACADEMY_OFFERINGS,
};
