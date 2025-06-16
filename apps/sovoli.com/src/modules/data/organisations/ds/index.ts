import type { OrgInstance } from "~/modules/organisations/types";
import { ORG_USERNAME } from "./constants";

export const DS_ORG_INSTANCE: OrgInstance = {
  org: {
    username: ORG_USERNAME,
    name: "Dominion Schools",
    claimed: false,
    categories: ["private-school"],
    locations: [
      {
        key: "main",
        address: {
          line1: "Lot 112 Regent Road",
          line2: "Bourda",
          city: "georgetown",
          country: "guyana",
        },
        contacts: [{ type: "phone", value: "+592 622-9382", isPublic: true }],
        isPrimary: true,
      },
    ],
  },
  websiteModule: null,
  academicModule: null,
  offeringModule: null,
  workforceModule: null,
};
