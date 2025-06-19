export interface Program {
  id: number;
  name: string;
  title?: string;
  slug: string;
  description: string;
  image?: string;
  requirements?: ProgramRequirement[];
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

export interface AcademicModule {
  programs: Program[];
}
