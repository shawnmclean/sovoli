import type { Item } from "../core/items/types";
import type { OrgLocation } from "../organisations/types";
export type ResourceType = "material" | "human" | "service" | "financial";

/** Standardized project lifecycle states */
export type ProjectStatus = "planned" | "active" | "completed" | "cancelled";

/** Priority classification */
export type ProjectPriority = "low" | "medium" | "high";

export interface ProjectResource {
  id: string;
  type: ResourceType; // e.g., "human" for volunteers, "material" for supplies
  title: string;
  description?: string;
  item?: Item; // Link to item catalog (for materials/services)
  role?: string; // e.g., "Electrician", "Teacher", "Contractor"
  quantity?: number;
  unit?: string; // e.g., "person", "sheet", "hour"
  priority?: ProjectPriority;
  status?: ProjectStatus;
  source?: "internal" | "external"; // External implies procurement
  neededBy?: {
    type: "deadline" | "asap";
    date?: string; // For deadlines
    reason?: string; // For ASAP requests
  };
  notes?: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  category?:
    | "maintenance"
    | "construction"
    | "education"
    | "event"
    | "relief"
    | "administration";
  status?: ProjectStatus;
  priority?: ProjectPriority;
  locationKey?: OrgLocation["key"];
  startDate?: string;
  endDate?: string;
  internal?: boolean; // true = purely internal project (no procurement)
  resources?: ProjectResource[]; // mixed manpower/material/service needs
  createdAt?: string;
  updatedAt?: string;
  notes?: string;
}

/** Projects module shape embedded into each org instance */
export interface ProjectsModule {
  projects: Project[];
}
