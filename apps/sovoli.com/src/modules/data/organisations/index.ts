import type { OrgInstance } from "~/modules/organisations/types";
import { FITRIGHT_ORG_INSTANCE } from "./fitright";
import { PRIVATE_SCHOOLS } from "./private-schools";
import { computeOrgScore } from "~/modules/organisations/computeScore";
// Add more imports as you implement more orgs

const orgs: OrgInstance[] = [
  ...PRIVATE_SCHOOLS,
  FITRIGHT_ORG_INSTANCE,
  // Add more org instances as you implement them
];

export const ORGS = orgs.map((org) => ({
  ...org,
  scoringModule: computeOrgScore(org),
}));
