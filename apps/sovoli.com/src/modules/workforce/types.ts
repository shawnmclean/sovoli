import type { Contact } from "../core/types";

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

export interface WorkforceMember {
  id: string;
  slug: string;
  name: string;
  image?: string;
  bio?: string;
  contacts?: Contact[];
  roleAssignments: OrgRoleAssignment[];
  isPublic?: boolean;
  quote?: string;
  subjectAssignments?: SubjectAssignment[];
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
