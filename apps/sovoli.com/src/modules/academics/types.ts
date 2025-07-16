import type { PricingPackage } from "../core/economics/types";
import type { CountryCode } from "../core/types";
import type { WorkforceMember } from "../workforce/types";

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
  levels?: ProgramLevel[];
}
export interface OrgProgram {
  standardProgramVersion?: StandardProgramVersion;

  name?: string; // "Nursery" (can override)
  tagline?: string;
  outcome?: string;
  slug: string; // "nursery"
  description?: string; // Custom or default
  // TODO: remove when we migrate to photos
  image?: string;
  photos?: Photo[];

  // Optional local overrides
  requirements?: ProgramRequirement[];
  notes?: string;
  isPopular?: boolean;
  levels?: ProgramLevel[];
}

// TODO: move to core or photos module
export interface Photo {
  category:
    | "environment"
    | "classroom"
    | "activities"
    | "events"
    | "awards"
    | "default";
  url: string;
  caption?: string;
  alt?: string;

  // TODO: for when we move the photos to cloudinary
  width?: number;
  height?: number;
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

export type OrgProgramCycleStatus = "open" | "closed" | "hidden";
export interface OrgProgramCycle {
  id: string; // e.g., "magy-nursery-2025-t1"
  orgProgram: OrgProgram;
  academicCycle: OrgAcademicCycle;

  registrationPeriod?: {
    startDate: string;
    endDate: string;
  };

  pricingPackage: PricingPackage;

  /**
   * Computed requirements at time of cycle, this is frozen at creation time.
   */
  computedRequirements: ProgramRequirement[];
  notes?: string;

  levelCycles?: ProgramLevelCycle[];

  status?: OrgProgramCycleStatus;
}

// #endregion

export interface ProgramLevelCycle {
  level: ProgramLevel;

  teachers?: WorkforceMember[];

  capacity?: number;
  enrolled?: number;

  notes?: string;
}

export interface ProgramLevel {
  id: string;
  order: number; // 0-based index (e.g., 0 = Pre-Nursery)
  label: string; // e.g., "Grade 1", "Form 3", "Year 2", "Beginner"
  type: "grade" | "form" | "year" | "level" | "custom";
  ageRange?: { min: number; max: number };

  courses?: Course[];
  activities?: Activity[];
}

export interface Subject {
  id: string;
  name: string;
}

export interface Course {
  id: string;
  subject: Subject;
  title: string;
  description?: string;
  units?: CourseUnit[];
}

export interface Activity {
  id: string;
  title: string;
}

export interface CourseUnit {
  title: string;
  topics: string[];
}

export interface AcademicModule {
  // swap to this after we move to OrgProgram
  programs: OrgProgram[];
  programCycles?: OrgProgramCycle[];

  // Temporary
  studentCount?: number;
}
