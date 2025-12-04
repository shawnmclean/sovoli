import type { LucideIcon } from "lucide-react";
import {
  Package,
  Wrench,
  Users,
  DollarSign,
  Briefcase,
} from "lucide-react";
import type { NeedType } from "./types";

/** Configuration shape for a need type */
export interface NeedTypeConfigItem {
  label: string;
  pluralLabel: string;
  icon: LucideIcon;
  textColor: string;
  bgColor: string;
}

/** Configuration for each need type including icons, labels, and colors */
export const NEED_TYPE_CONFIG: Record<NeedType, NeedTypeConfigItem> = {
  material: {
    label: "Material",
    pluralLabel: "Materials",
    icon: Package,
    textColor: "text-primary",
    bgColor: "bg-primary-100",
  },
  service: {
    label: "Service",
    pluralLabel: "Services",
    icon: Wrench,
    textColor: "text-secondary",
    bgColor: "bg-secondary-100",
  },
  human: {
    label: "Volunteer",
    pluralLabel: "Volunteers",
    icon: Users,
    textColor: "text-warning",
    bgColor: "bg-warning-100",
  },
  financial: {
    label: "Funding",
    pluralLabel: "Funding",
    icon: DollarSign,
    textColor: "text-success",
    bgColor: "bg-success-100",
  },
  job: {
    label: "Job",
    pluralLabel: "Jobs",
    icon: Briefcase,
    textColor: "text-danger",
    bgColor: "bg-danger-100",
  },
};

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
