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

type PreNurseryProgramId = "gy-pre-nursery";
type NurseryProgramId = "gy-nursery-year-1" | "gy-nursery-year-2";
type PrimaryProgramId =
  | "gy-primary-grade-1"
  | "gy-primary-grade-2"
  | "gy-primary-grade-3"
  | "gy-primary-grade-4"
  | "gy-primary-grade-5"
  | "gy-primary-grade-6";
type SecondaryProgramId =
  | "gy-secondary-form-1"
  | "gy-secondary-form-2"
  | "gy-secondary-form-3"
  | "gy-secondary-form-4"
  | "gy-secondary-form-5"
  | "gy-secondary-form-6";
export type StandardProgramId =
  | PreNurseryProgramId
  | NurseryProgramId
  | PrimaryProgramId
  | SecondaryProgramId;
export type AcademicAuthority = "MoE-GY";
export interface StandardProgram {
  id: StandardProgramId;
  name: string; // "Nursery"
  description: string;

  image?: string;

  country?: CountryCode;
  authority?: AcademicAuthority;
}

export interface StandardProgramVersion {
  id: string; // "gy-primary-v1"
  program: StandardProgram;
  version: number;

  name?: string;
  references?: string[];

  effectiveFrom: string;
  effectiveTo?: string;

  requirements?: ProgramRequirement[];
  assessments?: ProgramAssessmentVersion[];
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

export type ProgramCycleStatus = "open" | "closed" | "hidden";
export interface ProgramCycle {
  id: string; // e.g., "magy-nursery-2025-t1"
  academicCycle: OrgAcademicCycle;

  registrationPeriod?: {
    startDate: string;
    endDate: string;
  };

  teachers?: WorkforceMember[];
  capacity?: number;
  enrolled?: number;

  pricingPackage: PricingPackage;

  /**
   * Computed requirements at time of cycle, this is frozen at creation time.
   */
  // computedRequirements: ProgramRequirement[];
  notes?: string;

  status?: ProgramCycleStatus;
}

// #endregion

export interface ProgramGroup {
  id: string;
  label: string;
  programs: [
    {
      program: Program;
      order: number;
    },
  ];
}

export interface Program {
  id: string;
  slug: string; // e.g., "grade-1", "form-3", "year-2", "beginner"
  name?: string; // "Nursery" (can override)
  ageRange?: { min: number; max: number };

  courses?: Course[];
  activities?: Activity[];

  standardProgramVersion?: StandardProgramVersion;

  tagline?: string;
  outcome?: string;

  description?: string; // Custom or default

  photos?: Photo[];

  // Optional local overrides
  requirements?: ProgramRequirement[];
  notes?: string;
  isPopular?: boolean;
  testimonials?: ProgramTestimonial[];
  cycles?: ProgramCycle[];
}

export interface ProgramTestimonial {
  author: string;
  content: string;
  date?: string;
  rating: number;
  relation: "Parent" | "Student" | "Guardian";
  link?: string;
  source?: "google" | "facebook" | "other";
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
  programs: Program[];

  studentCount?: number;
}
