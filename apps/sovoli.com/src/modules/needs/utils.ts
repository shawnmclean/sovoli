import type { NeedType } from "./types";

/**
 * Present a human-friendly label for a `NeedType` value. The goal is to keep the
 * copy short and action oriented for directory listings.
 */
export function formatNeedTypeLabel(type: NeedType): string {
  switch (type) {
    case "material":
      return "Supplies & Materials";
    case "service":
      return "Services";
    case "human":
      return "People Support";
    case "financial":
      return "Financial Support";
    case "job":
      return "Job Opportunities";
    default:
      return "Other";
  }
}
