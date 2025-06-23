import type { OrgInstance } from "~/modules/organisations/types";

import { PRIVATE_SCHOOLS } from "./private-schools";
// import { computeOrgScoring } from "~/modules/scoring/lib/computeOrgScoring";
import { VOCATIONAL_SCHOOLS } from "./vocational-school";

const orgs: OrgInstance[] = [...PRIVATE_SCHOOLS, ...VOCATIONAL_SCHOOLS];

export const ORGS = await Promise.all(
  orgs.map((org) => ({
    ...org,
    scoringModule: null,
  })),
);
