import {
  BillingCycle,
  Discount,
  PricingItem,
  TargetType,
} from "../core/economics/types";
import type { AmountByCurrency, CountryCode } from "../core/types";

// #region cycles

export type GlobalAcademicCycleId = "gy-2025-t1" | "gy-2025-summer";
export interface GlobalAcademicCycle {
  id: GlobalAcademicCycleId; // "gy-2025-t1"
  label: string; // "Term 1 2025"
  country: CountryCode; // "gy"
  startDate: string;
  endDate: string;
  type: "term" | "semester" | "year" | "custom";
  standardCycleKey: "T1" | "S"; // "T1"
  academicYear: string; // "2025"
}

export interface OrgAcademicCycle {
  id: string; // "magy-2025-t1"
  globalCycle?: GlobalAcademicCycle;

  customLabel?: string; // override: "Easter Term 2025"
  startDate?: string; // optional override
  endDate?: string;
}

// #endregion

// #region programs

export type StandardProgramId = "gy-nursery" | "gy-primary" | "gy-secondary";
export type AcademicAuthority = "MoE-GY";
export interface StandardProgram {
  id: StandardProgramId;
  name: string; // "Nursery"
  description: string;

  image?: string;

  country?: CountryCode;
  authority?: AcademicAuthority;
}

export type StandardProgramVersionId =
  | "gy-nursery-v1"
  | "gy-primary-v1"
  | "gy-secondary-v1";

export interface StandardProgramVersion {
  id: StandardProgramVersionId; // "gy-primary-v1"
  program: StandardProgram;
  version: number;

  label?: string;
  references?: string[];

  effectiveFrom: string;
  effectiveTo?: string;

  requirements?: ProgramRequirement[];
  assessments?: ProgramAssessmentVersion[];
}
export interface OrgProgram {
  standardProgramVersion?: StandardProgramVersion;

  name?: string; // "Nursery" (can override)
  slug: string; // "nursery"
  description?: string; // Custom or default
  image?: string;

  // Optional local overrides
  requirements?: ProgramRequirement[];
  notes?: string;
}

export type ProgramRequirement = AgeRequirement | DocumentRequirement;

// Age Range Model (Precise Age Control)
export interface AgeRange {
  minAgeYears?: number;
  minAgeMonths?: number;
  maxAgeYears?: number;
  maxAgeMonths?: number;
}
export interface AgeRequirement {
  type: "age";
  description?: string;
  ageRange?: AgeRange;
  name?: string;
}

export interface DocumentRequirement {
  type: "document";
  name: string;
  description?: string;
}

export type ProgramAssessmentId = "ngsa";
export interface ProgramAssessment {
  id: ProgramAssessmentId; // e.g., "ngsa"
  name: string; // "National Grade Six Assessment"
  shortName?: string; // "NGSA"
  description?: string;
}

export interface ProgramAssessmentVersion {
  id: string; // "ngsa-v1"
  assessment: ProgramAssessment;
  version: number;

  effectiveFrom: string;
  effectiveTo?: string;
}

export type AcademicBillingCycle = BillingCycle | "termly";
export type AcademicTargetType = TargetType | "program" | "application";
type AcademicPricingItem = Omit<PricingItem, "billingCycle" | "appliesTo"> & {
  billingCycle: AcademicBillingCycle;
  appliesTo: AcademicTargetType[];
};

export interface ProgramFeeStructure {
  fees: AcademicPricingItem[];
  discounts?: Discount[];

  notes?: string; // e.g., "Includes books", "Excludes lunch"
}

export interface OrgProgramCycle {
  id: string; // e.g., "magy-nursery-2025-t1"
  orgProgram: OrgProgram;
  academicCycle: OrgAcademicCycle;

  registrationPeriod?: {
    startDate: string;
    endDate: string;
  };

  feeStructure?: ProgramFeeStructure;

  /**
   * Computed requirements at time of cycle, this is frozen at creation time.
   */
  computedRequirements: ProgramRequirement[];
  notes?: string;
}

// #endregion

export interface AcademicModule {
  // swap to this after we move to OrgProgram
  programs: OrgProgram[];
  programCycles?: OrgProgramCycle[];

  // Temporary
  studentCount?: number;
}
