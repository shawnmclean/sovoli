import type { PricingPackage } from "../core/economics/types";
import type { Item } from "../core/items/types";
import type { Media } from "../core/media/types";
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

export interface ProgramGroup {
  id: string;
  slug: string;
  name: string;
  description?: string;

  programs?: Program[];
}

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
  name: string;
  description: string;

  group?: ProgramGroup;

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

  admission?: AdmissionPolicy;
  assessments?: ProgramAssessmentVersion[];
  requirements?: RequirementList[];
}

export interface AdmissionPolicy {
  id: string; // "magy-nursery-y1-admissions"
  eligibility: EligibilityRule[]; // who can enroll
  documents: AdmissionDocumentRule[];
  notes?: string; // e.g., "Age as of first day of Term 1"
}
export type EligibilityRule = AgeEligibility;

// Age Range Model (Precise Age Control)
export interface AgeRange {
  minAgeYears?: number;
  minAgeMonths?: number;
  maxAgeYears?: number;
  maxAgeMonths?: number;
}
export interface AgeEligibility {
  type: "age";
  description?: string;
  ageRange?: AgeRange;
  name?: string;
}

export interface AdmissionDocumentRule {
  type: "document";
  name: string; // "Birth Certificate"
  description?: string; // "Original + 1 photocopy"
  requirement: "required" | "optional" | "conditional";
  conditionNote?: string; // "If transferring from another school"
}

export interface RequirementList {
  name: string; // "Nursery Year 1 — Books"
  category: "booklist" | "materials" | "uniform" | "other";
  audience?: "parent" | "student"; // UI hint
  notes?: string; // list-level notes
  items: RequirementListEntry[];
}

export interface RequirementListEntry {
  item: Item; // central Item (global definition)
  quantity?: number; // default: 1
  unit?: string; // e.g., "pack", "set", etc.
  isOptional?: boolean;
  source?: "bring" | "buy-at-school" | "either";
  notes?: string; // clarifications (e.g., "Label with name", "Plastic only")
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

export type ProgramHighlightIcon =
  | "graduation-cap" // Strong Foundations, Academic
  | "users" // Small Class Sizes
  | "user" // Personal Attention
  | "book-open" // Learning, Curriculum
  | "clock" // Flexible Scheduling
  | "star" // General highlight / excellence
  | "badge-check" // Certificate, Recognition
  | "scissors" // Sewing-specific
  | "shopping-bag" // Make & Take Bag
  | "hammer" // Hands-on / Vocational
  | "tool" // Tools Provided
  | "baby" // Age-specific (e.g. PreNursery)
  | "palette" // Creativity / Play
  | "school" // Primary school programs
  | "shield-check" // Gated / Safe Campus
  | "map-pin" // Location clarity
  | "smile" // Fun / Joyful learning
  | "message-circle"; // Teacher engagement / Chat access

export interface ProgramHighlight {
  icon: ProgramHighlightIcon;
  label: string;
  description: string;
}

/**
 * Media wrapper for programs - categorization happens at the usage site
 * instead of on the media item itself
 */
export interface ProgramMedia {
  /** Primary cover image for the program */
  cover?: Media;
  /** Gallery images for the program */
  gallery?: Media[];
}

export interface Program {
  id: string;
  slug: string; // e.g., "grade-1", "form-3", "year-2", "beginner"
  name?: string; // "Nursery" (can override)
  quickFacts?: string[];
  audience?: "student" | "parent";

  highlights?: ProgramHighlight[];

  courses?: Course[];
  activities?: Activity[];

  standardProgramVersion?: StandardProgramVersion;
  group?: ProgramGroup & { order?: number };

  tagline?: string;
  outcome?: string;

  description?: string; // Custom or default

  media?: ProgramMedia;

  // Optional local overrides
  admission?: AdmissionPolicy;
  requirements?: RequirementList[];
  notes?: string;
  isPopular?: boolean;
  testimonials?: ProgramTestimonial[];
  cycles?: ProgramCycle[];

  /** @deprecated Use capabilities instead */
  whatYouWillLearn?: ProgramWYLGroup[];
  capabilities?: Capability[];
}

// #region Capabilities

export interface Capability {
  wyl: string;
  description?: string;
  competencies: Competency[];
}

export interface Competency {
  statement: string;
}

// #endregion

// #region Legacy WYL types (deprecated)

/** @deprecated Use Competency instead */
export interface ProgramWYLItem {
  id: string; // stable within the program page (slug-like)
  title: string; // short, parent-facing
  blurb: string; // one-line promise / outcome
  tag?: string; // optional pill, e.g., "Hands-on", "Foundations"
}

/** @deprecated Use CompetencyGroup instead */
export interface ProgramWYLGroup {
  heading: string; // e.g., "Mathematics", "English", "Sewing"
  items: ProgramWYLItem[];
}

// #endregion

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
  id?: string; // optional ID for referencing from competencies
  title: string;
  topics: string[];
  competencyIds?: string[]; // bidirectional: competencies this unit addresses
}

export interface AcademicModule {
  programs: Program[];

  studentCount?: number;
}
