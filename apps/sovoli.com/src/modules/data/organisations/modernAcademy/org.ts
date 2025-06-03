import type { Org } from "../../../organisations/types";

export const MODERN_ACADEMY_ORG: Org = {
  username: "modern-academy",
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
        email: "info@modernacademy.com",
        phone: "+592-123-4567",
      },
      isPrimary: true,
    },
  ],
};
