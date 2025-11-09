import type { AmountByCurrency } from "../core/economics/types";
import type { Item } from "../core/items/types";
import type { OrgLocation } from "../organisations/types";

export type NeedPriority = "low" | "medium" | "high";

export type NeedStatus =
  | "planned"
  | "awaiting-approval"
  | "approved"
  | "ordered"
  | "fulfilled"
  | "cancelled";

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

export interface Need {
  id: string;
  title: string;
  description?: string;
  item: Item; // central Item (global definition)
  quantity?: number; // default: 1
  unit?: string; // e.g., "pack", "set", etc.
  priority?: NeedPriority;
  neededBy?: NeedTimeline;
  procurementWindow?: {
    start: string;
    end?: string;
  };
  totalBudget?: AmountByCurrency;
  requestingUnit?: {
    locationKey?: OrgLocation["key"];
  };
  status?: NeedStatus;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NeedsModule {
  needs: Need[];
}
