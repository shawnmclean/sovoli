import type { OrgCategoryGroupKey, OrgCategoryKeys } from "../types";

export const ORG_CATEGORY_KEYS: readonly OrgCategoryKeys[] = [
  "private-school",
  "public-school",
  "nursery-school",
  "primary-school",
  "special-education-school",
  "vocational-school",
  "beauty-school",
  "sewing-school",
  "stationery",
  "hardware",
  "diary-farm",
];

export const ORG_CATEGORY_GROUPS: Record<
  OrgCategoryGroupKey,
  readonly OrgCategoryKeys[]
> = {
  school: [
    "private-school",
    "public-school",
    "nursery-school",
    "primary-school",
    "special-education-school",
    "vocational-school",
    "beauty-school",
    "sewing-school",
  ],
};

type MissingOrgCategoryKeys = Exclude<
  OrgCategoryKeys,
  (typeof ORG_CATEGORY_KEYS)[number]
>;
// If this fails, `ORG_CATEGORY_KEYS` is missing a valid `OrgCategoryKeys` value.
const _assertAllOrgCategoryKeysAreRegistered: MissingOrgCategoryKeys extends never
  ? true
  : never = true;

const ORG_CATEGORY_KEY_LOOKUP = new Set<OrgCategoryKeys>(ORG_CATEGORY_KEYS);

const ORG_CATEGORY_GROUP_ENTRIES = Object.entries(ORG_CATEGORY_GROUPS) as [
  OrgCategoryGroupKey,
  readonly OrgCategoryKeys[],
][];

const normalizeCategoryValue = (value: string) => value.trim().toLowerCase();

export const resolveOrgCategoryFilter = (
  category: string,
): OrgCategoryKeys[] => {
  const normalized = normalizeCategoryValue(category);
  if (!normalized) {
    return [];
  }

  if (Object.hasOwn(ORG_CATEGORY_GROUPS, normalized)) {
    const groupKey = normalized as OrgCategoryGroupKey;
    return [...ORG_CATEGORY_GROUPS[groupKey]];
  }

  if (ORG_CATEGORY_KEY_LOOKUP.has(normalized as OrgCategoryKeys)) {
    return [normalized as OrgCategoryKeys];
  }

  return [];
};

export const getOrgCategoryGroupKeysForCategories = (
  categories: readonly OrgCategoryKeys[],
): OrgCategoryGroupKey[] => {
  const groups = new Set<OrgCategoryGroupKey>();
  for (const [groupKey, groupCategories] of ORG_CATEGORY_GROUP_ENTRIES) {
    if (categories.some((category) => groupCategories.includes(category))) {
      groups.add(groupKey);
    }
  }
  return [...groups];
};

export const orgCategoriesIncludeGroup = (
  categories: readonly OrgCategoryKeys[],
  groupKey: OrgCategoryGroupKey,
) => {
  const groupCategories = ORG_CATEGORY_GROUPS[groupKey];
  return groupCategories.some((category) => categories.includes(category));
};
