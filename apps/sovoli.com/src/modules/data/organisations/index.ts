import type { OrgInstance } from "~/modules/organisations/types";
import { FITRIGHT_ORG_INSTANCE } from "./fitright";
import { PRIVATE_SCHOOLS_GUYANA } from "./private-schools/guyana";
// Add more imports as you implement more orgs

export const ORGS: OrgInstance[] = [
  ...PRIVATE_SCHOOLS_GUYANA,
  FITRIGHT_ORG_INSTANCE,
  // Add more org instances as you implement them
];
