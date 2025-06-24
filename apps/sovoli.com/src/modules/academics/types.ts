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

export interface ProgramRequirement {
  type: "age" | "document";
  description?: string; // Detailed description of the requirement
  ageRange?: AgeRange; // Only if type is "age"
  name?: string;
}

// Age Range Model (Precise Age Control)
export interface AgeRange {
  minAgeYears?: number;
  minAgeMonths?: number;
  maxAgeYears?: number;
  maxAgeMonths?: number;
}

export interface ProgramFeeStructure {
  registrationFee?: number; // Optional if global
  tuitionFee: number;
  cycle?: "monthly" | "termly" | "annually" | "per-course"; // Flexible
  currency?: string; // Optional override
  notes?: string; // e.g., "Includes books", "Excludes lunch"
}

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
