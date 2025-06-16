import type { OrgInstance } from "~/modules/organisations/types";
import { FITRIGHT_ORG_INSTANCE } from "./fitright";
import { PRIVATE_SCHOOLS } from "./private-schools";
// Add more imports as you implement more orgs

export const ORGS: OrgInstance[] = [
  ...PRIVATE_SCHOOLS,
  FITRIGHT_ORG_INSTANCE,
  // Add more org instances as you implement them
];
