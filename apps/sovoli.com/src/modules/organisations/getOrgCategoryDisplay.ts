import type { Org } from "./types";

const toTitleCase = (value: string) =>
  value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

/**
 * Returns the organisation's display label for category/legal classification.
 *
 * Priority:
 * 1) `org.categoryDisplay` if provided (UI-only override)
 * 2) Fallback to first 1–2 `org.categories` keys, formatted and joined with "and"
 */
export function getOrgCategoryDisplay(org: Org): string | null {
  const override = org.categoryDisplay?.trim();
  if (override) return override;

  const categories = org.categories;
  const top = categories.slice(0, 2);
  if (top.length === 0) return null;

  const formatted = top.map((c) => toTitleCase(c.replaceAll("-", " ")));
  const first = formatted[0];
  if (!first) return null;
  const second = formatted[1];
  return second ? `${first} and ${second}` : first;
}

