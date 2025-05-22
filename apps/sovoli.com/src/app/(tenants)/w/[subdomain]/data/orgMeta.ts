export interface OrgMeta {
  name: string;
  slug: string;
  country: string;
  city: string;
  address: string;
  contacts: { email: string; phone: string }[];
}

export const orgMeta: OrgMeta = {
  name: "Modern Academy",
  slug: "magy",
  country: "Guyana",
  city: "Georgetown",
  address: "123 Main Street",
  contacts: [
    {
      email: "info@magy.academy",
      phone: "1234567890",
    },
  ],
};
