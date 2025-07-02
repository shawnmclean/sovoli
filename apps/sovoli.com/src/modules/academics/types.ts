import type { CountryCode } from "../core/types";

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
  orgId: string; // "magy"
  globalCycleId?: GlobalAcademicCycleId;
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

  country?: CountryCode;
  authority?: AcademicAuthority;
}

export type StandardProgramVersionId =
  | "gy-nursery-v1"
  | "gy-primary-v1"
  | "gy-secondary-v1";

export interface StandardProgramVersion {
  id: StandardProgramVersionId; // "gy-primary-v1"
  programId: StandardProgramId;
  version: number;

  label?: string;
  references?: string[];

  effectiveFrom: string;
  effectiveTo?: string;

  requirements?: ProgramRequirement[];
  assessments?: ProgramAssessmentVersion[];
}
export interface OrgProgram {
  id: string; // e.g., "magy-nursery"
  orgId: string; // "magy"

  standardProgramVersionId?: StandardProgramVersionId;

  name?: string; // "Nursery" (can override)
  slug: string; // "nursery"
  description?: string; // Custom or default
  image?: string;

  // Optional local overrides
  requirements?: ProgramRequirement[];
  notes?: string;
}

// TODO: remove in favour of OrgProgram
export interface Program {
  id: number;
  name: string;
  title?: string;
  slug: string;
  description: string;
  image: string;
  requirements?: ProgramRequirement[];
  feeStructure?: ProgramFeeStructure;
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
  assessmentId: ProgramAssessmentId; // "ngsa"
  version: number;

  effectiveFrom: string;
  effectiveTo?: string;
}

export interface ProgramFeeStructure {
  registrationFee?: number; // Optional if global
  tuitionFee: number;
  cycle?: "monthly" | "termly" | "annually" | "per-course"; // Flexible
  currency?: string; // Optional override
  notes?: string; // e.g., "Includes books", "Excludes lunch"
}

export interface OrgProgramCycle {
  id: string; // e.g., "magy-nursery-2025-t1"
  orgProgramId: string; // "magy-nursery"
  academicCycleId: string; // e.g., "magy-2025-t1"

  feeStructure: ProgramFeeStructure;

  /**
   * Computed requirements at time of cycle, this is frozen at creation time.
   */
  computedRequirements: ProgramRequirement[];
  notes?: string;
}

// #endregion

export interface AcademicModule {
  programs: Program[];

  // swap to this after we move to OrgProgram
  _programs: OrgProgram[];
  programCycles: OrgProgramCycle[];

  // Temporary
  studentCount?: number;
  globalRegistrationFee?: {
    amount: number;
    currency?: string;
    notes?: string;
  };
}
