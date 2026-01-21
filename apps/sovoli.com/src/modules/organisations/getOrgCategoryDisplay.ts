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
 * 2) Fallback to the first `org.categories` key, formatted
 */
export function getOrgCategoryDisplay(org: Org): string | null {
  const unsafeOrg = org as unknown as {
    categoryDisplay?: unknown;
    categories?: unknown;
  };

  const overrideValue = unsafeOrg.categoryDisplay;
  const override = typeof overrideValue === "string" ? overrideValue.trim() : "";
  if (override) return override;

  const categories = unsafeOrg.categories;
  const firstCategory =
    Array.isArray(categories) && typeof categories[0] === "string"
      ? categories[0]
      : null;
  if (!firstCategory) return null;

  return toTitleCase(firstCategory.replaceAll("-", " "));
}

