import type { OrgInstance } from "~/modules/organisations/types";

import { PRIVATE_SCHOOLS } from "./private-schools";
import { computeOrgScore } from "~/modules/organisations/computeScore";
import { VOCATIONAL_TRAINING } from "./vocational-training";
// Add more imports as you implement more orgs

const orgs: OrgInstance[] = [
  ...PRIVATE_SCHOOLS,
  ...VOCATIONAL_TRAINING,
  // Add more org instances as you implement them
];

export const ORGS = orgs.map((org) => ({
  ...org,
  scoringModule: computeOrgScore(org),
}));
