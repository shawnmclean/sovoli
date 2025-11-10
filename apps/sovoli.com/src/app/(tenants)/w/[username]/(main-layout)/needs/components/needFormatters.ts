"use client";

import type { AmountByCurrency } from "~/modules/core/economics/types";
import type { Need } from "~/modules/needs/types";

export function formatDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatTimeline(need: Need) {
  const timeline = need.neededBy;
  if (!timeline) return null;

  if (timeline.type === "deadline") {
    const formatted = formatDate(timeline.date);
    return formatted ? `Needed by ${formatted}` : `Needed by ${timeline.date}`;
  }

  const requestedAt = timeline.requestedAt
    ? formatDate(timeline.requestedAt)
    : null;
  const reason = timeline.reason ? ` — ${timeline.reason}` : "";

  if (requestedAt) {
    return `ASAP (requested ${requestedAt}${reason})`;
  }

  return `ASAP${reason}`;
}

export function formatStatus(status?: Need["status"]) {
  if (!status) return null;
  return status
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export function formatPriority(priority?: Need["priority"]) {
  switch (priority) {
    case "high":
      return "High";
    case "medium":
      return "Medium";
    case "low":
      return "Low";
    default:
      return null;
  }
}

export function getPriorityChipColor(priority?: Need["priority"]) {
  switch (priority) {
    case "high":
      return "danger";
    case "medium":
      return "warning";
    case "low":
      return "default";
    default:
      return "default";
  }
}

export function getStatusChipColor(status?: Need["status"]) {
  switch (status) {
    case "approved":
    case "fulfilled":
      return "success";
    case "ordered":
      return "primary";
    case "awaiting-approval":
      return "warning";
    case "cancelled":
      return "danger";
    default:
      return "default";
  }
}

export function formatAmountByCurrency(amount?: AmountByCurrency) {
  if (!amount) return null;

  const entries = Object.entries(amount).filter(
    (entry): entry is [string, number] => typeof entry[1] === "number",
  );

  if (entries.length === 0) {
    return null;
  }

  return entries
    .map(([currency, value]) => {
      const formatter = new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      });

      return formatter.format(value);
    })
    .join(" • ");
}

export function formatEmploymentType(
  employmentType?:
    | "full-time"
    | "part-time"
    | "contract"
    | "temporary"
    | "volunteer",
) {
  if (!employmentType) return null;
  return employmentType
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}
