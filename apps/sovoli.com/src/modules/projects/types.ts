import type { OrgLocation } from "../organisations/types";
import type { Need } from "../needs/types";
import type { Media } from "../core/media/types";

/** Standardized project lifecycle states */
export type ProjectStatus = "planned" | "active" | "completed" | "cancelled";

/** Priority classification */
export type ProjectPriority = "low" | "medium" | "high" | "critical";

/** Optional project categories */
export type ProjectCategory =
  | "maintenance"
  | "construction"
  | "education"
  | "event"
  | "relief"
  | "administration"
  | "other";

export interface ProjectGroup {
  id: string;
  slug: string;
  name: string;
  description?: string;
  projects?: Project[];
}

export interface ProjectPhase {
  /** Unique slug for the phase, used for routing to phase details page */
  slug: string;
  title: string;
  description?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  startDate?: string;
  endDate?: string;
  /** Resolved needs from needSlugs references */
  needs?: Need[];
  media?: Media[];
}

/**
 * A project represents an initiative or operation carried out by a school/org.
 * Each project may include multiple Needs (materials, human resources, services, etc.).
 * Some Needs may also exist outside of projects.
 */
export interface Project {
  /** Globally unique ID */
  id: string;

  /** Project title */
  title: string;

  group?: ProjectGroup & { order?: number };

  /** Project media (photos and videos) */
  media?: Media[];

  /** Description and purpose */
  description?: string;

  /** Classification (used for filtering or grouping) */
  category?: ProjectCategory;

  /** Current state of the project */
  status?: ProjectStatus;

  /** How critical or important this project is */
  priority?: ProjectPriority;

  /** Where it’s taking place */
  locationKey?: OrgLocation["key"];

  /** Timeline */
  startDate?: string;
  endDate?: string;

  /** If true, means this is an internal initiative (no external procurement) */
  internal?: boolean;

  /** Linked needs (external or internal resources). */
  needs?: Need[];

  phases?: ProjectPhase[];

  /** Free-form labels for discovery/filtering (e.g., hurricane ids). */
  tags?: string[];

  /** Metadata */
  createdAt?: string;
  updatedAt?: string;
  notes?: string;
}

/** Collection wrapper for embedding under an organization instance */
export interface ProjectsModule {
  projects: Project[];
}
