import type { Org } from "../../../organisations/types";
import { ORG_USERNAME } from "./constants";

export const MODERN_ACADEMY_ORG: Org = {
  username: ORG_USERNAME,
  name: "Modern Academy",
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
};
