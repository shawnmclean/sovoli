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

export interface AcademicCycle {
  id: string; // "magy-2025-t1"
  globalCycleId?: GlobalAcademicCycleId; // points to "guyana-2025-t1"
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

export interface StandardProgramVersion {
  id: string; // "gy-primary-v1"
  programId: StandardProgramId;
  version: number;

  label?: string;
  references?: string[];

  effectiveFrom: string;
  effectiveTo?: string;

  requirements?: ProgramRequirement[];
  assessments?: ProgramAssessmentVersion[];
}

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

export interface ProgramCycle {
  schoolCycleId: string; // links to "magy-2025-t1"
  feeStructure: ProgramFeeStructure;
  resolvedRequirements: ProgramRequirement[];
}

// #endregion

export interface AcademicModule {
  programs: Program[];

  // Temporary
  studentCount?: number;
  globalRegistrationFee?: {
    amount: number;
    currency?: string;
    notes?: string;
  };
}
