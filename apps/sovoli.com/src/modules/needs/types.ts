import type { AmountByCurrency } from "../core/economics/types";
import type { Item } from "../core/items/types";
import type { OrgLocation } from "../organisations/types";

/** How important this need is */
export type NeedPriority = "low" | "medium" | "high";

/** Current state of the need */
export type NeedStatus =
  | "planned"
  | "awaiting-approval"
  | "approved"
  | "ordered"
  | "fulfilled"
  | "cancelled";

/** The category of what kind of need this is */
export type NeedType = "material" | "human" | "service" | "financial";

/** Source of fulfillment */
export type NeedSource = "internal" | "external";

/** Timeline for when the need is required */
export type NeedTimeline =
  | {
      type: "deadline";
      date: string; // ISO date string
    }
  | {
      type: "asap";
      requestedAt?: string; // ISO date string
      reason?: string;
    };

/** Optional procurement metadata */
export interface ProcurementInfo {
  supplier?: string;
  estimatedCost?: number;
  currency?: keyof AmountByCurrency;
  status?: "quoted" | "ordered" | "delivered" | "cancelled";
  notes?: string;
}

/** Primary entity describing a school or org requirement */
export interface Need {
  id: string;
  title: string;
  description?: string;

  /** Reference to the global item definition */
  item?: Item;

  /** Quantitative details */
  quantity?: number; // default: 1
  unit?: string; // e.g., "pack", "set", etc.

  /** Classification and context */
  type?: NeedType;
  source?: NeedSource;
  projectId?: string; // optional link to a project
  priority?: NeedPriority;

  /** Timing and budget */
  neededBy?: NeedTimeline;
  procurementWindow?: {
    start: string;
    end?: string;
  };
  totalBudget?: AmountByCurrency;

  /** Organisational context */
  requestingUnit?: {
    locationKey?: OrgLocation["key"];
  };

  /** Status and notes */
  status?: NeedStatus;
  procurement?: ProcurementInfo;
  notes?: string;

  /** Metadata */
  createdAt?: string;
  updatedAt?: string;
}

/** Container for embedding in org instance */
export interface NeedsModule {
  needs: Need[];
}
