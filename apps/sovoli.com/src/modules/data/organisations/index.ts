import type { OrgInstance } from "~/modules/organisations/types";
import { MODERN_ACADEMY_ACADEMIC } from "./magy/academic";
import { MODERN_ACADEMY_OFFERINGS } from "./magy/offering";
import { MODERN_ACADEMY_ORG } from "./magy/org";
import { MODERN_ACADEMY_WEBSITE } from "./magy/website";

export const ORGS: OrgInstance[] = [
  {
    org: MODERN_ACADEMY_ORG,
    websiteModule: MODERN_ACADEMY_WEBSITE,
    academicModule: MODERN_ACADEMY_ACADEMIC,
    offeringModule: MODERN_ACADEMY_OFFERINGS,
  },
];
