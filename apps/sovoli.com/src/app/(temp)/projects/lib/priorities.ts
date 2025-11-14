import type { ProjectDirectoryEntry } from "../types";

type PriorityLevel = ProjectDirectoryEntry["priority"];

const PRIORITY_CLASSES: Record<
  string,
  { badge: string; text: string; label: string }
> = {
  critical: {
    badge: "bg-red-600 text-white",
    text: "text-red-600",
    label: "Critical priority",
  },
  emergency: {
    badge: "bg-red-700 text-white",
    text: "text-red-700",
    label: "Emergency priority",
  },
  high: {
    badge: "bg-orange-500 text-white",
    text: "text-orange-500",
    label: "High priority",
  },
  medium: {
    badge: "bg-amber-500 text-white",
    text: "text-amber-500",
    label: "Medium priority",
  },
  low: {
    badge: "bg-sky-500 text-white",
    text: "text-sky-500",
    label: "Low priority",
  },
};

export function getPriorityBadgeClass(priority?: PriorityLevel) {
  if (!priority) return "bg-blue-600 text-white";
  const normalized = priority.toLowerCase();
  return PRIORITY_CLASSES[normalized]?.badge ?? "bg-blue-600 text-white";
}

export function getPriorityTextClass(priority?: PriorityLevel) {
  if (!priority) return "text-blue-600";
  const normalized = priority.toLowerCase();
  return PRIORITY_CLASSES[normalized]?.text ?? "text-blue-600";
}

export function getPriorityLabel(priority?: PriorityLevel) {
  if (!priority) return "Priority pending";
  const normalized = priority.toLowerCase();
  return (
    PRIORITY_CLASSES[normalized]?.label ?? `${capitalize(priority)} priority`
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
