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
  landmark?: string;
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

// #region Verification

export interface OrgVerificationDocument {
  type: "business_registration" | "tax_id" | "operating_license" | "other";
  name: string; // name of document or registered entity
  url?: string; // upload/download link
  uploadedAt: string;

  // Document Metadata
  issuedDate?: string; // from doc (e.g., "2020-02-28")
  referenceNumber?: string; // e.g. "178271" from certificate
  issuingAuthority?: string; // e.g., "Office of Registrar of Business Names"
  issuingJurisdiction?: Jurisdiction; // see below

  // Optional additions
  expiryDate?: string;
  notes?: string;
}

export interface Jurisdiction {
  country: string; // ISO 3166-1 alpha-2, e.g. "GY"
  stateOrProvince?: string; // e.g. "Demerara-Mahaica" or "California"
  cityOrRegion?: string; // optional; e.g. "Georgetown"
}

export interface OrgVerification {
  status: "pending" | "verified" | "rejected";
  submittedAt: string;
  verifiedAt?: string;
  rejectedReason?: string;

  submittedBy: string; // admin ID or email
  documents: OrgVerificationDocument[];
  incorporationDate?: string;

  notes?: string;
}

// #endregion

export interface Org {
  username: string;
  name: string;
  logo?: string;
  categories: OrgCategoryKeys[];
  locations: OrgLocation[];
  socialLinks?: SocialLink[];

  verification?: OrgVerification;

  isVerified?: boolean;

  // internal CRM fields
  internalCRM?: {
    people: Person[];
    claimStatus?: "unclaimed" | "pending" | "claimed";
    claimedAt?: string;
    claimedBy?: string;
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
