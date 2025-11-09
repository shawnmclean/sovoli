import type { AmountByCurrency } from "../core/economics/types";
import type { Item } from "../core/items/types";
import type { OrgLocation } from "../organisations/types";
import type { Position } from "../workforce/types";

/** How important this need is */
export type NeedPriority = "low" | "medium" | "high";

/** Current state of the need */
export type NeedStatus =
  | "planned"
  | "awaiting-approval"
  | "approved"
  | "ordered"
  | "fulfilled"
  | "cancelled"
  | "in-progress"
  | "hiring";

/** The category of what kind of need this is */
export type NeedType = "material" | "human" | "service" | "financial" | "job";

/** Source of fulfillment */
export type NeedSource = "internal" | "external";

/** Timeline for when the need is required */
export type NeedTimeline =
  | { type: "deadline"; date: string } // ISO date string
  | { type: "asap"; requestedAt?: string; reason?: string };

/** Optional procurement metadata */
export interface ProcurementInfo {
  supplier?: string;
  estimatedCost?: number;
  currency?: keyof AmountByCurrency;
  status?: "quoted" | "ordered" | "delivered" | "cancelled";
  notes?: string;
}

/** Primary entity describing a school or org requirement (shared fields) */
export interface NeedBase {
  id: string;
  title: string;
  description?: string;

  /** Classification and context */
  source?: NeedSource;
  projectId?: string; // optional link to a project
  priority?: NeedPriority;

  /** Timing and budget */
  neededBy?: NeedTimeline;
  procurementWindow?: { start: string; end?: string };
  totalBudget?: AmountByCurrency;

  /** Organisational context */
  requestingUnit?: { locationKey?: OrgLocation["key"] };

  /** Status and notes */
  status?: NeedStatus;
  procurement?: ProcurementInfo;
  notes?: string;

  /** Metadata */
  createdAt?: string;
  updatedAt?: string;
}

/** ─── Variants ──────────────────────────────────────────────────────────── */

/** 1) MATERIAL: concrete goods. Enforce item + quantity. */
export interface MaterialNeed extends NeedBase {
  type: "material";
  item: Item;
  quantity: number; // required for materials
  unit?: string; // e.g., "pack", "set"
}

/** 2) SERVICE: contractor/RFP-type needs. */
export interface ServiceNeed extends NeedBase {
  type: "service";
  serviceCategory?: string; // e.g., "Roof Repair", "Electrical", "Painting"
  statementOfWork?: string[];
  rfpUrl?: string; // public RFP page
  bidsCloseAt?: string; // ISO date
}

/** 3) HUMAN: non-formal labor (e.g., volunteers, temp helpers). */
export interface HumanNeed extends NeedBase {
  type: "human";
  roleSummary?: string;
  headcount?: number;
  shiftPattern?: string; // e.g., "Sat 9–3"
  skills?: string[];
}

/** 4) FINANCIAL: funding/donation/sponsorship needs. */
export interface FinancialNeed extends NeedBase {
  type: "financial";
  targetAmount?: AmountByCurrency;
  pledgeUrl?: string;
}

/** 5) JOB: formal position to hire; references workforce Position. */
export interface JobNeed extends NeedBase {
  type: "job";
  position?: Position; // optional denormalized embed for UI
  openings?: number;
  employmentType?:
    | "full-time"
    | "part-time"
    | "contract"
    | "temporary"
    | "volunteer";
  applicationDeadline?: string; // ISO date
  contactEmail?: string;
  contactPhone?: string;
  filledByMemberIds?: string[]; // workforce.members ids once hired
}

/** Union of all need variants */
export type Need =
  | MaterialNeed
  | ServiceNeed
  | HumanNeed
  | FinancialNeed
  | JobNeed;

/** Container for embedding in org instance */
export interface NeedsModule {
  needs: Need[];
}

/** ─── Type Guards (handy in loaders/components) ─────────────────────────── */

export const isMaterialNeed = (n: Need): n is MaterialNeed =>
  n.type === "material";
export const isServiceNeed = (n: Need): n is ServiceNeed =>
  n.type === "service";
export const isHumanNeed = (n: Need): n is HumanNeed => n.type === "human";
export const isFinancialNeed = (n: Need): n is FinancialNeed =>
  n.type === "financial";
export const isJobNeed = (n: Need): n is JobNeed => n.type === "job";
