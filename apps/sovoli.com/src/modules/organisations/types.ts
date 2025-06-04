// Core operational identity
export interface Org {
  username: string; // e.g., "modern-academy"
  name: string; // Human name of the org
  logo?: string; // Logo URL
  claimed: boolean; // Claimed or auto-listed
  categories: string[]; // e.g., ["private-school", "nursery"]
  locations: OrgLocation[]; // At least 1 location
}

export interface OrgLocation {
  key: string; // e.g., "georgetown"
  country: string;
  state?: string;
  city?: string;
  address: string;
  contacts: {
    email?: string;
    phone?: string;
  };
  isPrimary?: boolean;
}
