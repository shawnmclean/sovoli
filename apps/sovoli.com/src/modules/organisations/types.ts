import type { AcademicModule } from "../academics/types";
import type { Contact, SocialLink } from "../core/types";
import type { OfferingModule } from "../offerings/types";
import type { WebsiteModule } from "../websites/types";
import type { WorkforceModule } from "../workforce/types";

export interface Address {
  line1?: string;
  line2?: string;
  line3?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country: string;
}

export interface OrgLocation {
  key: string;
  label?: string;
  isPrimary?: boolean;
  address: Address;
  coordinates?: {
    lat: number;
    lng: number;
  };
  placeId?: string;
  contacts: Contact[];
}

export interface Org {
  username: string;
  name: string;
  logo?: string;
  claimed: boolean;
  categories: string[];
  locations: OrgLocation[];
  socialLinks?: SocialLink[];
}

export interface OrgInstance {
  org: Org;
  websiteModule: WebsiteModule | null;
  academicModule: AcademicModule | null;
  offeringModule: OfferingModule | null;
  workforceModule: WorkforceModule | null;
}
