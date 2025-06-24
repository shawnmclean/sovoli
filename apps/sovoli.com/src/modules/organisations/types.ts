import type { AcademicModule } from "../academics/types";
import type { Contact, SocialLink } from "../core/types";
import type { OfferingModule } from "../offerings/types";
import type { ScoringModule } from "../scoring/types";
import type { WebsiteModule } from "../websites/types";
import type { WorkforceModule } from "../workforce/types";

// For use internally
export interface Person {
  name: string;
  contacts: Contact[];
  notes?: string;
}

export interface Address {
  line1?: string;
  line2?: string;
  line3?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  countryCode: string;
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
  categories: OrgCategoryKeys[];
  locations: OrgLocation[];
  socialLinks?: SocialLink[];

  // internal CRM fields
  isVerified?: boolean;
  internalCRM?: {
    people: Person[];
  };

  techStack?: OrgTechStack;
}

export interface OrgInstance {
  org: Org;
  websiteModule: WebsiteModule | null;
  academicModule: AcademicModule | null;
  offeringModule: OfferingModule | null;
  workforceModule: WorkforceModule | null;
  scoringModule: ScoringModule | null;
}

export type OrgInstanceWithWebsite = Omit<OrgInstance, "websiteModule"> & {
  websiteModule: WebsiteModule;
};

export type OrgCategoryKeys =
  | "private-school"
  | "nursery-school"
  | "vocational-school";

// #region Tech Stack
export type TechCategory =
  | "website"
  | "enrollment"
  | "sis"
  | "lms"
  | "parentPortal"
  | "billing"
  | "messaging"
  | "hr"
  | "security"
  | "transport"
  | "library"
  | "analytics"
  | "compliance";

/*
  Platform Type
  - manual: the school handles the work manually
  - integrated: the school uses an integrated system
  - external: the school uses an external system
  */
export type PlatformType = "manual" | "integrated" | "external";

export interface PlatformInfo {
  name: string;
  vendor?: string;
  url?: string;
  type?: PlatformType;
  notes?: string;
}

export interface EnrollmentPlatform extends PlatformInfo {
  method: "manual" | "whatsapp" | "external-form" | "integrated";
  formUrl?: string;
}

export type OrgTechStack = Omit<
  Partial<Record<TechCategory, PlatformInfo | PlatformInfo[]>>,
  "enrollment"
> & {
  enrollment?: EnrollmentPlatform;
  notes?: string;
};

// #endregion
