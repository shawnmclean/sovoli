import type { AcademicModule } from "../academics/types";
import type { OfferingModule } from "../offerings/types";
import type { WebsiteModule } from "../websites/types";

// Core operational identity
export interface Org {
  username: string; // e.g., "modern-academy"
  name: string; // Human name of the org
  logo?: string; // Logo URL
  claimed: boolean; // Claimed or auto-listed
  categories: string[]; // e.g., ["private-school", "nursery"]
  locations: OrgLocation[]; // At least 1 location
  socialLinks?: SocialLink[];
}

export interface Contact {
  type: "phone" | "email" | "fax" | "whatsapp" | "website" | "other";
  label?: string; // e.g. "Main Office", "Admissions WhatsApp"
  value: string;
}

// not supporting linkedin: https://github.com/simple-icons/simple-icons/issues/11236
export interface SocialLink {
  platform: "facebook" | "instagram" | "youtube" | "x" | "website" | "other";
  label?: string; // Optional UI label e.g. "Follow us on Facebook"
  url: string;
}

export interface OrgLocation {
  key: string;
  label?: string;
  isPrimary?: boolean;
  address: {
    line1: string;
    line2?: string;
    line3?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country: string; // ISO 3166-1 (e.g. "Guyana", "US")
  };

  coordinates?: {
    lat: number;
    lng: number;
  };

  contacts: Contact[];
}

export interface OrgInstance {
  org: Org;
  websiteModule: WebsiteModule | null;
  academicModule: AcademicModule | null;
  offeringModule: OfferingModule | null;
}
