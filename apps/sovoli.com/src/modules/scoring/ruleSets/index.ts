import type { OrgCategoryKeys } from "~/modules/organisations/types";
import type { CategoryRuleSet } from "../types";
import { privateSchoolRuleSet } from "./privateSchoolRuleSet";

export const ruleSets: Partial<Record<OrgCategoryKeys, CategoryRuleSet>> = {
  "private-school": privateSchoolRuleSet,
};
