import type { AmountByCurrency } from "../core/economics/types";
import type { Contact } from "../core/types";
import type { Media } from "../core/media/types";

export interface Department {
  name: string;
  slug: string;
  description: string;
  image: string;
  url: string;
}

export interface Team {
  name: string;
  slug: string;
  description: string;
  image: string;
  url: string;
}

export interface Position {
  name: string;
  slug: string;
  description: string;
  image: string;
  url: string;

  qualifications?: string[];
  employmentType?:
    | "full-time"
    | "part-time"
    | "contract"
    | "temporary"
    | "volunteer";
  compensationRange?: {
    min?: AmountByCurrency;
    max?: AmountByCurrency;
    period?: "hourly" | "monthly" | "annual";
  };
}

export interface OrgRoleAssignment {
  position: Position;
  department?: Department;
  team?: Team;
  startDate?: string;
  endDate?: string;
  isPrimary?: boolean;
  titleOverride?: string;
  notes?: string;
}

export interface Education {
  level: string; // e.g., "Bachelor of Science", "Associate Degree", "Certificate", "Diploma"
  field: string; // e.g., "Production Management Clothing Designing", "Fashion Merchandising"
  institution?: string; // e.g., "Fashion Institute of Technology, New York"
  startDate?: string; // optional for timelines
  endDate?: string; // optional for timelines
  location?: string; // e.g., "New York, USA"
  honors?: string; // e.g., "Summa Cum Laude", "Distinction"
  notes?: string; // free text field for context
  url?: string; // link to institution or program
}

export interface WorkforceMember {
  id: string;
  slug: string;
  name: string;
  photo?: Media;
  bio?: string;
  contacts?: Contact[];
  roleAssignments: OrgRoleAssignment[];
  isPublic?: boolean;
  quote?: string;
  subjectAssignments?: SubjectAssignment[];
  education?: Education[];
}

export interface WorkforceModule {
  members: WorkforceMember[];
  departments: Department[];
  teams: Team[];
  positions: Position[];
}

// TODO: Move this into academics module later and make better models
export interface SubjectAssignment {
  subject: string;
  grades: string[];
}
