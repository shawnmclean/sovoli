import type { AcademicModule } from "../academics/types";
import type { Contact, SocialLink } from "../core/types";
import type { OfferingModule } from "../offerings/types";
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
  categories: string[];
  locations: OrgLocation[];
  socialLinks?: SocialLink[];

  // internal CRM fields
  isVerified?: boolean;
  internalCRM?: {
    people: Person[];
  };
}

export interface OrgInstance {
  org: Org;
  websiteModule: WebsiteModule | null;
  academicModule: AcademicModule | null;
  offeringModule: OfferingModule | null;
  workforceModule: WorkforceModule | null;
  scoringModule?: ScoringModule;
}

// -- scoring module

export interface ScoringModule {
  totalScore: number; // normalized 0–100 or similar
  digitalScore?: ScoringDimension;
  academicScore?: ScoringDimension;
  workforceScore?: ScoringDimension;
  offeringScore?: ScoringDimension;
  websiteScore?: ScoringDimension;
  metadataScore?: ScoringDimension;
}

export interface ScoringDimension {
  score: number;
  maxScore: number;
  weight: number; // used during totalScore calc
  breakdown: Record<
    string,
    {
      label: string;
      score: number;
      maxScore: number;
      note?: string;
    }
  >;
}

export interface OrgScoreRule {
  key: string;
  label: string;
  maxScore: number;
  compute: (ctx: OrgInstance) => number;
  note?: string;
}

export interface ScoringDimensionConfig {
  key: string;
  label: string;
  weight: number;
  rules: OrgScoreRule[];
}
